import { Schema, model, Document, Types } from "mongoose";

export enum UserRole {
  STUDENT = "STUDENT",
  PARENT = "PARENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

export interface IAuth extends Document {
  email: string;
  role: UserRole;
  userId: Types.ObjectId;
  userModel: "Student" | "Parent" | "Tutor";
  otpCode: string | null;
  otpExpiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const authSchema = new Schema<IAuth>(
  {
    email: {
      type: String,
      required: [true, "Identity tracking email address string is required."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, "System authorization role enum is required."],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "Polymorphic target profile identifier is required."],
      refPath: "userModel", // The magic link that connects to any collection dynamically
    },
    userModel: {
      type: String,
      required: [
        true,
        "Target collection string mapping reference is required.",
      ],
      enum: ["Student", "Parent", "Tutor"],
    },
    otpCode: {
      type: String,
      trim: true,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for ultra-fast lookup queries on logins
authSchema.index({ email: 1 });

export const Auth = model<IAuth>("Auth", authSchema);
