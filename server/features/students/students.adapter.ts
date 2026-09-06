import { IStudent } from "./students.model.js";
import logger from "../../utils/logger.js";

// Define a type for what the clean client/parent output looks like
export interface IStudentResponse {
  id: string;
  fullName: string;
  grade: string;
  school: string;
  subjects: string[];
  paymentStatus: "Paid" | "Unpaid" | "Partially Paid";
  overallScore: string; // E.g., "75%" formatted neatly
  parentName: string;
  parentPhone: string;
  canAccessClass: boolean; // Simple Gatekeeper flag for the door check
  notes?: string;
  registeredOn: string; // Formatted readable date string
}

export class StudentAdapter {
  /**
   * Transforms a single raw MongoDB student document into a clean, structured API payload
   */
  static toResponse(student: IStudent): IStudentResponse {
    logger.info(
      `🔄 [StudentAdapter] Transforming data payload for student: ${student.fullName}`,
    );

    return {
      id: (student._id as any).toString(), // Bypasses the strict compiler block safely to grab the raw string ID
      fullName: student.fullName,
      grade: student.grade,
      school: student.school,
      subjects: student.subjects,
      paymentStatus: student.paymentStatus,
      overallScore: `${student.overallScore}%`,
      parentName: student.parent.name,
      parentPhone: student.parent.phone,
      canAccessClass: student.paymentStatus !== "Unpaid",
      notes: student.notes,
      registeredOn: new Date(student.createdAt).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }

  /**
   * Transforms an array of raw database documents into clean, structured API lists
   */
  static toResponseCollection(students: IStudent[]): IStudentResponse[] {
    logger.info(
      `📋 [StudentAdapter] Processing collection transformation for ${students.length} records`,
    );
    return students.map((student) => this.toResponse(student));
  }
}
