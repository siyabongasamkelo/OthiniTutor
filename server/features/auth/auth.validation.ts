import { z } from "zod";
import { Types } from "mongoose";
import { UserRole } from "./auth.model.js";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid database identifier format" })
  .transform((val) => new Types.ObjectId(val));

export const requestOtpSchema = z.object({
  body: z.object({
    email: z
      .string({
        message: "Login account verification email string is required.",
      })
      .trim()
      .email("Please provide a valid structural email formatting pattern."),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .string({
        message: "Verification tracking email address string required.",
      })
      .trim()
      .email(),
    otpCode: z
      .string({
        message: "6-digit authentication entry code string is required.",
      })
      .trim()
      .length(6, "The verification code must be exactly 6 digits long."),
  }),
});

export const registerIdentitySchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Profile linkage email string required." })
      .trim()
      .email(),
    role: z.nativeEnum(UserRole, {
      message: "Valid application operational role enum required.",
    }),
    userId: objectIdSchema,
    userModel: z.enum(["Student", "Parent", "Tutor"], {
      message: "Valid polymorphic string schema required.",
    }),
  }),
});
