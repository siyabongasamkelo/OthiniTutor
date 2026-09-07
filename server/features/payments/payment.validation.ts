import { z } from "zod";
import { Types } from "mongoose";
import { PaymentType } from "./payment.model.js";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid database identifier format" })
  .transform((val) => new Types.ObjectId(val));

export const initializePaymentSchema = z.object({
  body: z.object({
    student: objectIdSchema,
    guardian: objectIdSchema,
    amount: z.number().min(1, "Payment amount must be at least 1 ZAR."),
    className: z
      .string({ required_error: "Class name field parameter required." })
      .trim()
      .min(2),
    paymentType: z.nativeEnum(PaymentType).optional(),
  }),
});

export const getPaymentByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const getPaymentsByStudentSchema = z.object({
  params: z.object({
    studentId: objectIdSchema,
  }),
});

export const manualReceiptUploadSchema = z.object({
  body: z.object({
    student: objectIdSchema,
    guardian: objectIdSchema,
    amount: z.number().min(1),
    className: z.string().trim(),
    receiptImage: z
      .string()
      .url("Valid URL layout link required for visual proof file."),
  }),
});
