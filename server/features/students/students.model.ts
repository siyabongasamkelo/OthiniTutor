import { Schema, model, Document } from "mongoose";

// 1. Define sub-document interface
export interface IParent extends Document {
  name: string;
  phone: string;
  whatsApp?: string;
}

// Define main student document interface
export interface IStudent extends Document {
  fullName: string;
  email?: string;
  contactNo: string;
  whatsAppNo?: string;
  grade: string;
  school: string;
  subjects: string[];
  paymentStatus: "Paid" | "Unpaid" | "Partially Paid";
  overallScore: number;
  parent: IParent; // Linked to the sub-document interface
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create the Parent Sub-document Schema First
const parentSchema = new Schema<IParent>(
  {
    name: {
      type: String,
      required: [true, "Parent/Guardian name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Parent contact number is required"],
      trim: true,
    },
    whatsApp: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: false },
); // _id: false prevents Mongoose from adding a separate ID to every parent field unless you explicitly want it.

// 3. Create the Main Student Schema referencing the sub-document
const studentSchema = new Schema<IStudent>(
  {
    fullName: {
      type: String,
      required: [true, "Student full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    contactNo: {
      type: String,
      required: [true, "Student contact number is required"],
      trim: true,
    },
    whatsAppNo: {
      type: String,
      required: false,
      trim: true,
    },
    grade: {
      type: String,
      required: [true, "Grade level is required"],
    },
    school: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
    },
    subjects: {
      type: [String],
      required: [true, "At least one subject must be selected"],
      validate: [
        (val: string[]) => val.length > 0,
        "Must have at least one subject",
      ],
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "Partially Paid"],
      default: "Unpaid",
    },
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    parent: {
      type: parentSchema, // Embedded parent schema as a sub-document
      required: [true, "Parent/Guardian details are completely required"],
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Student = model<IStudent>("Student", studentSchema);
