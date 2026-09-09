import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid database identifier format" })
  .transform((val) => new Types.ObjectId(val));

// Universal fix: Remove configuration parameters from z.number() and let .min(0) handle constraints
const pricingValidationSchema = z.object({
  singleLessonPrice: z
    .number({ message: "Single lesson price must be a valid number" })
    .min(0, "Price cannot be negative"),
  monthlyLessonPrice: z
    .number({ message: "Monthly lesson price must be a valid number" })
    .min(0, "Price cannot be negative"),
  singleTermPrice: z
    .number({ message: "Single term price must be a valid number" })
    .min(0, "Price cannot be negative"),
  yearlyPrice: z
    .number({ message: "Yearly price must be a valid number" })
    .min(0, "Price cannot be negative"),
});

const socialsValidationSchema = z.object({
  facebookLink: z
    .string()
    .url("Invalid Facebook URL")
    .trim()
    .optional()
    .or(z.literal("")),
  otherSocialMediaLink: z
    .string()
    .url("Invalid social media URL")
    .trim()
    .optional()
    .or(z.literal("")),
  websiteLink: z
    .string()
    .url("Invalid website URL")
    .trim()
    .optional()
    .or(z.literal("")),
});

export const createTutorZodSchema = z.object({
  body: z.object({
    // Universal fix: Using .min(1) ensures the string isn't empty, acting as a clean required check
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),
    contactNo: z
      .string()
      .trim()
      .min(1, "Contact number is required")
      .min(10, "Contact number must be at least 10 digits"),
    whatsAppNo: z.string().trim().optional(),
    subjects: z
      .array(z.string())
      .min(1, "At least one subject must be selected"),
    picture: z.string().url("Invalid picture URL").optional(),
    payfastApiKey: z.string().trim().optional(),
    pricing: pricingValidationSchema,
    nameOfSchool: z.string().trim().optional(),
    socials: socialsValidationSchema.optional(),
  }),
});

export const updateTutorZodSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: createTutorZodSchema.shape.body.partial(),
});

export const tutorIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const studentIdParamSchema = z.object({
  params: z.object({
    studentId: objectIdSchema,
  }),
});
