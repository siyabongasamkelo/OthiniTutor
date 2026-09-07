import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid database identifier format" })
  .transform((val) => new Types.ObjectId(val));

export const createParentSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Parent full identity name string is required." })
      .trim()
      .min(2, "Parent name must be at least 2 characters long."),
    email: z
      .string({ message: "Email is required." })
      .trim()
      .email("Invalid email address format."),
    contactNo: z
      .string({
        message: "Parent primary operational phone contact string is required.",
      })
      .trim()
      .min(
        10,
        "Contact number must contain a valid length (Minimum 10 digits).",
      ),
    whatsappNo: z.string().trim().optional(),
    child: z
      .array(objectIdSchema, { message: "At least one child ID is required." })
      .min(1, "A parent must be linked to at least one child student."),
  }),
});

export const updateParentSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z.string().trim().min(2).optional(),
    email: z.string().trim().email().optional(),
    contactNo: z.string().trim().min(10).optional(),
    whatsappNo: z.string().trim().optional(),
    child: z.array(objectIdSchema).min(1).optional(),
  }),
});

export const getParentByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const getParentByStudentSchema = z.object({
  params: z.object({
    studentId: objectIdSchema,
  }),
});
