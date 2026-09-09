import { Student, IStudent } from "./students.model.js";
import logger from "../../utils/logger.js";

export class StudentRepository {
  /**
   * Registers a brand new student into the system database
   */
  static async create(
    studentData: Partial<IStudent>,
    options?: { session: any },
  ): Promise<IStudent> {
    logger.info(
      `✍️ [StudentRepository] Initiating registration for new student: ${studentData.fullName}`,
    );
    const student = new Student(studentData);
    const savedStudent = await student.save();
    logger.info(
      `✅ [StudentRepository] Student registered successfully with ID: ${savedStudent._id}`,
    );
    return savedStudent;
  }

  /**
   * Fetches all registered students matching an optional filter
   */
  static async findAll(filter: Partial<IStudent> = {}): Promise<IStudent[]> {
    logger.info(
      `🔍 [StudentRepository] Fetching students list with filter properties`,
    );
    const students = await Student.find(filter).sort({ fullName: 1 });
    logger.info(
      `📋 [StudentRepository] Found ${students.length} student records`,
    );
    return students;
  }

  /**
   * Finds a single student document by its unique MongoDB ID
   */
  static async findById(id: string): Promise<IStudent | null> {
    logger.info(
      `🔍 [StudentRepository] Looking up student record for ID: ${id}`,
    );
    const student = await Student.findById(id);
    if (!student) {
      logger.warn(
        `⚠️ [StudentRepository] No student document found matching ID: ${id}`,
      );
    } else {
      logger.info(
        `✨ [StudentRepository] Student record located for: ${student.fullName}`,
      );
    }
    return student;
  }

  /**
   * Modifies an existing student record or nested sub-documents
   */
  static async update(
    id: string,
    updateData: Partial<IStudent>,
  ): Promise<IStudent | null> {
    logger.info(`🔄 [StudentRepository] Updating student record for ID: ${id}`);
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );
    if (!updatedStudent) {
      logger.error(
        `❌ [StudentRepository] Failed to update. Student ID ${id} not found.`,
      );
    } else {
      logger.info(
        `✅ [StudentRepository] Successfully updated records for: ${updatedStudent.fullName}`,
      );
    }
    return updatedStudent;
  }

  /**
   * Removes a student document from the system completely
   */
  static async delete(id: string): Promise<IStudent | null> {
    logger.info(
      `🗑️ [StudentRepository] Request received to delete student ID: ${id}`,
    );
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      logger.warn(
        `⚠️ [StudentRepository] Deletion skipped. ID ${id} did not exist.`,
      );
    } else {
      logger.info(
        `🛑 [StudentRepository] Successfully wiped student record: ${deletedStudent.fullName}`,
      );
    }
    return deletedStudent;
  }

  /**
   * Filters all students based on their physical school institution
   */
  static async getBySchool(schoolName: string): Promise<IStudent[]> {
    logger.info(
      `🏫 [StudentRepository] Querying students attending school: ${schoolName}`,
    );
    const students = await Student.find({
      school: { $regex: new RegExp(schoolName, "i") },
    }).sort({ fullName: 1 });
    logger.info(
      `📊 [StudentRepository] Found ${students.length} students at ${schoolName}`,
    );
    return students;
  }

  /**
   * Filters students by their respective academic grade
   */
  static async getByGrade(grade: string): Promise<IStudent[]> {
    logger.info(
      `🎓 [StudentRepository] Querying all students in class: ${grade}`,
    );
    const students = await Student.find({ grade }).sort({ fullName: 1 });
    logger.info(
      `📊 [StudentRepository] Found ${students.length} active students in ${grade}`,
    );
    return students;
  }

  /**
   * Finds all students taking a specific subject field
   */
  static async getBySubject(subject: string): Promise<IStudent[]> {
    logger.info(
      `📚 [StudentRepository] Querying students registered for subject: ${subject}`,
    );
    const students = await Student.find({
      subjects: { $in: [subject] },
    }).sort({ fullName: 1 });
    logger.info(
      `📊 [StudentRepository] Found ${students.length} students taking ${subject}`,
    );
    return students;
  }

  /**
   * Core Gatekeeper operation: Filters by financial standing
   */
  static async getByPaymentStatus(
    status: "Paid" | "Unpaid" | "Partially Paid",
  ): Promise<IStudent[]> {
    logger.info(
      `💰 [StudentRepository] Querying gatekeeper database for status: ${status}`,
    );
    const students = await Student.find({ paymentStatus: status }).sort({
      fullName: 1,
    });
    logger.info(
      `🛑 [StudentRepository] Gatekeeper query returned ${students.length} matches for [${status}]`,
    );
    return students;
  }

  /**
   * Live search matching student names, phone numbers, or parent contact lines
   */
  static async searchStudents(queryStr: string): Promise<IStudent[]> {
    logger.info(
      `⚡ [StudentRepository] Execution of live door-search for query terminal: "${queryStr}"`,
    );
    const searchRegex = new RegExp(queryStr, "i");
    const students = await Student.find({
      $or: [
        { fullName: searchRegex },
        { contactNo: searchRegex },
        { "parent.phone": searchRegex },
      ],
    }).sort({ fullName: 1 });
    logger.info(
      `🎯 [StudentRepository] Door-search matched ${students.length} records for term: "${queryStr}"`,
    );
    return students;
  }
}
