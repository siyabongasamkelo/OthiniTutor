import { StudentRepository } from "./students.repository.js";
import { StudentAdapter, IStudentResponse } from "./students.adapter.js";
import { IStudent } from "./students.model.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../utils/logger.js";

export class StudentService {
  // ==========================================================================
  // 1. REGISTRATION WORKFLOW PIPELINE
  // ==========================================================================
  /**
   * Orchestrates the registration of a new student, enforces proper string casing,
   * and verifies required parameters using the global error contract framework.
   */
  static async registerStudent(
    studentData: Partial<IStudent>,
  ): Promise<IStudentResponse> {
    logger.info(
      `🧠 [StudentService] Processing business registration workflow for: ${studentData.fullName}`,
    );

    // Strict contract check upfront to enforce architectural data safety rules
    if (
      !studentData.fullName ||
      !studentData.contactNo ||
      !studentData.grade ||
      !studentData.school ||
      !studentData.parent
    ) {
      logger.error(
        "Registration Workflow Failed: Missing primary structural attributes on incoming body",
      );
      throw new ApiError(
        400,
        "Student full name, contact number, grade, school, and parent details are strictly required structural parameters.",
      );
    }

    // Capitalize names for uniform display on physical attendance lists at Tugela High
    studentData.fullName = studentData.fullName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    const newStudent = await StudentRepository.create(studentData);
    logger.info(
      `📱 [StudentService] Dispatched hook for registration confirmation to parent: ${newStudent.parent.phone}`,
    );

    return StudentAdapter.toResponse(newStudent);
  }

  // ==========================================================================
  // 2. RETRIEVE MASTER COLLECTION LIST
  // ==========================================================================
  /**
   * Retrieves an array of all registered students transformed into sanitized payloads.
   */
  static async getAllStudents(
    filter: Partial<IStudent> = {},
  ): Promise<IStudentResponse[]> {
    logger.info(
      `🧠 [StudentService] Fetching transformed student records database collection`,
    );
    const rawStudents = await StudentRepository.findAll(filter);
    return StudentAdapter.toResponseCollection(rawStudents);
  }

  // ==========================================================================
  // 3. RETRIEVE ISOLATED INDIVIDUAL PROFILE
  // ==========================================================================
  /**
   * Locates a single student record matching a database ID or throws an explicit 404 error asset.
   */
  static async getStudentById(id: string): Promise<IStudentResponse> {
    logger.info(
      `🧠 [StudentService] Processing individual profile lookup pipeline for student ID: ${id}`,
    );

    if (!id) {
      logger.error(
        "Profile Lookup Aborted: Missing critical identification parameter lookup string",
      );
      throw new ApiError(
        400,
        "A valid student identification database token is required.",
      );
    }

    const student = await StudentRepository.findById(id);
    if (!student) {
      logger.error(
        `Profile Lookup Aborted: Student document token ${id} was not discovered in the system.`,
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
   * Edits a student profile or tracking status, validating target asset presence.
   */
  static async updateStudentProfile(
    id: string,
    updateData: Partial<IStudent>,
  ): Promise<IStudentResponse> {
    logger.info(
      `🧠 [StudentService] Processing structural profile modification request for student ID: ${id}`,
    );

    if (!id) {
      logger.error(
        "Modification Action Cancelled: Identifier parameter argument is missing",
      );
      throw new ApiError(
        400,
        "Target student reference identifier token is required to perform edits.",
      );
    }

    const updatedStudent = await StudentRepository.update(id, updateData);
    if (!updatedStudent) {
      logger.error(
        `Modification Action Aborted: Student reference context ${id} does not map to a live database record.`,
      );
      throw new ApiError(
        404,
        "Cannot execute profile changes. Target student record was not found.",
      );
    }

    // Security compliance audit logging for tracking changes made right at the door
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
   * Wipes an existing student document from persistent storage or triggers an explicit 404.
   */
  static async removeStudent(id: string): Promise<void> {
    logger.info(
      `🧠 [StudentService] Executing termination deletion workflow for student ID: ${id}`,
    );

    if (!id) {
      logger.error(
        "Deletion Sequence Halted: Target deletion parameter token is missing",
      );
      throw new ApiError(
        400,
        "Student identification reference is required to drop data sheets.",
      );
    }

    const deleted = await StudentRepository.delete(id);
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
  static async getGatekeeperDoorList(
    queryStr?: string,
  ): Promise<IStudentResponse[]> {
    logger.info(
      `⚡ [StudentService] Running live data manifest calculation engine for gate check-in screens`,
    );

    let rawStudents: IStudent[];

    if (queryStr && queryStr.trim().length > 0) {
      logger.info(
        `🔍 [StudentService] Intercepting door screen lookup filters using search query parameter: "${queryStr}"`,
      );
      rawStudents = await StudentRepository.searchStudents(queryStr);
    } else {
      rawStudents = await StudentRepository.findAll();
    }

    return StudentAdapter.toResponseCollection(rawStudents);
  }

  // ==========================================================================
  // 7. ROSTER SORTING BY SCHOOL BOUNDARY
  // ==========================================================================
  /**
   * Extracts clean matching profiles filtered explicitly by high school boundaries.
   */
  static async getRosterBySchool(
    schoolName: string,
  ): Promise<IStudentResponse[]> {
    if (!schoolName) {
      logger.error(
        "School Roster Grouping Aborted: Institution query string parameter is missing",
      );
      throw new ApiError(
        400,
        "A target secondary school institution search parameter is required.",
      );
    }
    logger.info(
      `🧠 [StudentService] Fetching enrollment roster logs for school name: ${schoolName}`,
    );
    const rawStudents = await StudentRepository.getBySchool(schoolName);
    return StudentAdapter.toResponseCollection(rawStudents);
  }

  // ==========================================================================
  // 8. ROSTER SORTING BY GRADE DIVISION
  // ==========================================================================
  /**
   * Extracts clean matching profiles filtered explicitly by educational grade divisions.
   */
  static async getRosterByGrade(grade: string): Promise<IStudentResponse[]> {
    if (!grade) {
      logger.error(
        "Grade Roster Grouping Aborted: Class tier parameter input string is missing",
      );
      throw new ApiError(
        400,
        "A target educational grade class boundary level is required.",
      );
    }
    logger.info(
      `🧠 [StudentService] Fetching class schedule metrics for grade tier division: ${grade}`,
    );
    const rawStudents = await StudentRepository.getByGrade(grade);
    return StudentAdapter.toResponseCollection(rawStudents);
  }
}
