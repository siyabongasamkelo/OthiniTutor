import { StudentRepository } from "./students.repository.js";
import { StudentAdapter, IStudentResponse } from "./students.adapter.js";
import { IAuthServiceGateway } from "../auth/auth.interface.js"; // Strictly importing the decoupled interface contract
import { IStudent } from "./students.model.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../utils/logger.js";
import mongoose from "mongoose";
import { UserRole } from "../auth/auth.model.js";

export class StudentService {
  private studentRepo: typeof StudentRepository;
  private authGateway: IAuthServiceGateway;

  // Injected at runtime construction to achieve maximum architectural decoupling
  constructor(
    studentRepo: typeof StudentRepository,
    authGateway: IAuthServiceGateway,
  ) {
    this.studentRepo = studentRepo;
    this.authGateway = authGateway;
  }

  // ==========================================================================
  // 1. REGISTRATION WORKFLOW PIPELINE
  // ==========================================================================
  /**
   * Orchestrates the registration of a new student, enforces proper string casing,
   * and maps security access lines. Data is fully pre-validated via Zod.
   */
  async registerStudent(
    studentData: Partial<IStudent>,
  ): Promise<IStudentResponse> {
    logger.info(
      `🧠 [StudentService] Processing business registration workflow for: ${studentData.fullName}`,
    );

    // Format names uniformly for physical attendance lists at Tugela High
    // Safe to run because Zod ensures fullName is a valid string at the gate
    studentData.fullName = studentData
      .fullName!.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // Initialize the isolated atomic database session context
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Step 1: Persist the clean student record into the database
      const newStudent = await this.studentRepo.create(studentData, {
        session,
      });

      // Step 2: Fallback configuration for emails. If email is empty, default to contact number
      const loginIdentityEmail =
        newStudent.email && newStudent.email.trim() !== ""
          ? newStudent.email
          : `${newStudent.contactNo}@tutorapp.local`;

      // Step 3: Trigger the polymorphic security wrapper using the interface contract gateway
      await this.authGateway.createSystemIdentity(
        {
          email: loginIdentityEmail,
          // role: "STUDENT",
          role: UserRole.STUDENT,
          userId: newStudent._id as mongoose.Types.ObjectId,
          userModel: "Student",
        },
        session,
      );

      // Commit operations if both collections write successfully
      await session.commitTransaction();
      logger.info(
        `📱 [StudentService] Dispatched hook for registration confirmation to parent: ${newStudent.parent.phone}`,
      );

      return StudentAdapter.toResponse(newStudent);
    } catch (error: any) {
      // Rollback database changes safely to protect system integrity
      await session.abortTransaction();
      logger.error(
        `[StudentService] Transaction sequence failed. Database reverted safely. Error: ${error.message}`,
      );
      throw new ApiError(
        500,
        `Student profile and login identity registration process failed: ${error.message}`,
      );
    } finally {
      session.endSession();
    }
  }

  // ==========================================================================
  // 2. RETRIEVE MASTER COLLECTION LIST
  // ==========================================================================
  /**
   * Retrieves an array of all registered students transformed into sanitized payloads.
   */
  async getAllStudents(
    filter: Partial<IStudent> = {},
  ): Promise<IStudentResponse[]> {
    logger.info(
      `🧠 [StudentService] Fetching transformed student records database collection`,
    );
    const rawStudents = await this.studentRepo.findAll(filter);
    return StudentAdapter.toResponseCollection(rawStudents);
  }

  // ==========================================================================
  // 3. RETRIEVE ISOLATED INDIVIDUAL PROFILE
  // ==========================================================================
  /**
   * Locates a single student record matching a database ID.
   */
  async getStudentById(id: string): Promise<IStudentResponse> {
    logger.info(
      `🧠 [StudentService] Processing individual profile lookup pipeline for student ID: ${id}`,
    );

    const student = await this.studentRepo.findById(id);
    if (!student) {
      logger.error(
        `Profile Lookup Aborted: Student document token ${id} was not discovered.`,
      );
      throw new ApiError(
        404,
        "The requested student record could not be located inside our system files.",
      );
    }

    return StudentAdapter.toResponse(student);
  }

  // ==========================================================================
  // 4. RESOURCE PROFILE MODIFICATION LAYER
  // ==========================================================================
  /**
   * Edits an existing student profile, logging audit metrics cleanly.
   */
  async updateStudentProfile(
    id: string,
    updateData: Partial<IStudent>,
  ): Promise<IStudentResponse> {
    logger.info(
      `🧠 [StudentService] Processing structural profile modification request for student ID: ${id}`,
    );

    const updatedStudent = await this.studentRepo.update(id, updateData);
    if (!updatedStudent) {
      logger.error(
        `Modification Action Aborted: Student reference context ${id} does not map to a live record.`,
      );
      throw new ApiError(
        404,
        "Cannot execute profile changes. Target student record was not found.",
      );
    }

    // Security compliance audit logging for financial modifications
    if (updateData.paymentStatus) {
      logger.warn(
        `💰 [StudentService] AUDIT METRIC: Financial status for ${updatedStudent.fullName} changed to [${updatedStudent.paymentStatus}]`,
      );
    }

    return StudentAdapter.toResponse(updatedStudent);
  }

  // ==========================================================================
  // 5. DATA WIPE DELETION WORKFLOW
  // ==========================================================================
  /**
   * Wipes an existing student document from persistent storage.
   */
  async removeStudent(id: string): Promise<void> {
    logger.info(
      `🧠 [StudentService] Executing termination deletion workflow for student ID: ${id}`,
    );

    const deleted = await this.studentRepo.delete(id);
    if (!deleted) {
      logger.error(
        `Deletion Sequence Failed: Target token reference ${id} did not match an active record.`,
      );
      throw new ApiError(
        404,
        "Deletion sequence aborted. Target student profile record was not found.",
      );
    }

    logger.info(
      `✅ [StudentService] Student profile deletion sequence completed cleanly for ID: ${id}`,
    );
  }

  // ==========================================================================
  // 6. GATEKEEPER LIVE MANIFEST ENGINE (The Door Dashboard Monitor)
  // ==========================================================================
  /**
   * Generates real-time manifest outputs to verify entry permission state at the classroom door.
   */
  async getGatekeeperDoorList(queryStr?: string): Promise<IStudentResponse[]> {
    logger.info(
      `⚡ [StudentService] Running live data manifest calculation engine for gate check-in screens`,
    );

    let rawStudents: IStudent[];

    if (queryStr && queryStr.trim().length > 0) {
      logger.info(
        `🔍 [StudentService] Intercepting door screen lookup filters using search query parameter: "${queryStr}"`,
      );
      rawStudents = await this.studentRepo.searchStudents(queryStr);
    } else {
      rawStudents = await this.studentRepo.findAll();
    }

    return StudentAdapter.toResponseCollection(rawStudents);
  }

  // ==========================================================================
  // 7. ROSTER SORTING BY SCHOOL BOUNDARY
  // ==========================================================================
  /**
   * Extracts clean matching profiles filtered explicitly by high school boundaries.
   */
  async getRosterBySchool(schoolName: string): Promise<IStudentResponse[]> {
    logger.info(
      `🔍 [StudentService] Fetching class roster details restricted to school: ${schoolName}`,
    );
    const rawStudents = await this.studentRepo.findAll({ school: schoolName });
    return StudentAdapter.toResponseCollection(rawStudents);
  }
}
