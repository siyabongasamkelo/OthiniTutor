import { Schema, model, Document, Types } from "mongoose";

interface IReview {
  parentOrStudentId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface IClass extends Document {
  title: string;
  tutor: Types.ObjectId;
  subjects: string[];
  grade: number;
  topicsCovered: string[];
  date: Date;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  venueType: "IN_PERSON" | "ONLINE";
  locationDetails: string;
  price: number;
  notes?: string;
  photos: string[];
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    parentOrStudentId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const classSchema = new Schema<IClass>(
  {
    title: {
      type: String,
      required: [true, "Class title is required."],
      trim: true,
    },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: "Tutor",
      required: [true, "Tutor reference identifier is required."],
    },
    subjects: [
      {
        type: String,
        required: [true, "At least one subject must be specified."],
        trim: true,
      },
    ],
    grade: {
      type: Number,
      required: [true, "Target school grade (8-12) is required."],
      min: [8, "Grade cannot be lower than Grade 8."],
      max: [12, "Grade cannot be higher than Grade 12."],
    },
    topicsCovered: [
      {
        type: String,
        trim: true,
      },
    ],
    date: {
      type: Date,
      required: [true, "Scheduled date for the class is required."],
    },
    startTime: {
      type: String,
      required: [true, "Start time (e.g., '14:30') is required."],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, "Ending time (e.g., '16:00') is required."],
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: [true, "Class duration in minutes is required."],
      min: 1,
    },
    venueType: {
      type: String,
      enum: ["IN_PERSON", "ONLINE"],
      required: [true, "Venue type must be specified."],
    },
    locationDetails: {
      type: String,
      required: [
        true,
        "Location venue details or meeting link string is required.",
      ],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Class price tag fee amount is required."],
      min: [0, "Price cannot be negative."],
    },
    notes: {
      type: String,
      trim: true,
    },
    photos: [
      {
        type: String,
        trim: true,
      },
    ],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  },
);

// Optimize matching indexes for fast operational query parameters
classSchema.index({ date: 1, subjects: 1, venueType: 1 });

export const ClassModel = model<IClass>("Class", classSchema);
