import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid database identifier format" })
  .transform((val) => new Types.ObjectId(val));

export const createClassSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "Class session title is required." })
      .trim()
      .min(3),
    tutor: objectIdSchema,
    subjects: z
      .array(z.string().trim())
      .min(1, "Specify at least one subject module."),
    grade: z.number().min(8).max(12),
    topicsCovered: z.array(z.string().trim()).default([]),
    date: z.string().transform((val) => new Date(val)),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid 24h start time format (HH:MM).",
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid 24h end time format (HH:MM).",
      ),
    durationMinutes: z
      .number()
      .min(15, "Minimum session duration is 15 minutes."),
    venueType: z.enum(["IN_PERSON", "ONLINE"]),
    locationDetails: z
      .string({
        message: "Venue address or digital classroom url string required.",
      })
      .trim(),
    price: z
      .number()
      .min(0, "Price fee parameters cannot be negative numbers."),
    notes: z.string().trim().optional(),
    photos: z.array(z.string().url()).default([]),
  }),
});

export const filterQuerySchema = z.object({
  query: z.object({
    date: z.string().optional(),
    subject: z.string().trim().optional(),
    location: z.string().trim().optional(),
  }),
});

export const classIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
