import { z } from "zod";
import { Types } from "mongoose";

// 🚀 Re-using your exact reusable MongoDB ObjectId transformation magic!
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid database identifier format" })
  .transform((val) => new Types.ObjectId(val));

// ==========================================
// 1. NESTED PARENT / GUARDIAN STRUCTURAL SCHEMA
// ==========================================
const parentValidationSchema = z.object({
  name: z
    .string({
      message: "Parent/Guardian full identity name string is required.",
    })
    .trim()
    .min(2, "Parent name must be at least 2 characters long."),

  phone: z
    .string({
      message: "Parent primary operational phone contact string is required.",
    })
    .trim()
    .min(10, "Contact number must contain a valid length (Minimum 10 digits)."),

  whatsApp: z.string().trim().optional(),
});

// ==========================================
// 2. STUDENT REGISTRATION (CREATE) REQUEST VALIDATION
// ==========================================
export const createStudentSchema = z.object({
  fullName: z
    .string({ message: "Student complete legal name string is required." })
    .trim()
    .min(2, "Student full name must be at least 2 characters long."),

  email: z
    .string()
    .email(
      "Provided tracking address must conform to standard email formatting rules.",
    )
    .lowercase()
    .trim()
    .optional()
    .or(z.literal("")), // Allows empty string parameters to pass smoothly

  contactNo: z
    .string({ message: "Student active cellphone contact line is required." })
    .trim()
    .min(10, "Student contact number must be at least 10 digits."),

  whatsAppNo: z.string().trim().optional(),

  grade: z
    .string({
      message: "Academic grade classification level string is required.",
    })
    .trim()
    .min(1, "Grade field context identifier cannot be left blank."),

  school: z
    .string({
      message: "Target secondary education institution name is required.",
    })
    .trim()
    .min(2, "School name must contain descriptive characters."),

  subjects: z
    .array(z.string().trim(), {
      message: "Academic curriculum subjects array structure is required.",
    })
    .min(
      1,
      "At least one target study subject must be specified within the collection array.",
    ),

  paymentStatus: z
    .enum(["Paid", "Unpaid", "Partially Paid"], {
      message:
        "Payment state must strictly align with: Paid, Unpaid, or Partially Paid options.",
    })
    .default("Unpaid"),

  overallScore: z
    .number()
    .min(0, "Academic progress score evaluation cannot fall underneath 0%.")
    .max(
      100,
      "Academic baseline performance values cap dynamically out at 100%.",
    )
    .default(0),

  parent: parentValidationSchema, // Evaluates the incoming embedded sub-document request fields cleanly

  notes: z.string().trim().optional(),
});

// ==========================================
// 3. STUDENT PROFILE RECORD UPDATE VALIDATION
// ==========================================
// Uses partial strategy to ensure individual property modification updates can be selectively submitted
export const updateStudentSchema = createStudentSchema.partial();

// ==========================================
// 4. GATEKEEPER SEARCH / LOOKUP VALIDATION
// ==========================================
export const studentQuerySchema = z.object({
  searchQuery: z
    .string({
      message:
        "Search token parameter input string is required to perform live terminal match queries.",
    })
    .trim()
    .min(
      1,
      "Search queries must contain functional keyword characters to compute search records.",
    ),
});
