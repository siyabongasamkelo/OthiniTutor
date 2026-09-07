import { Schema, model, Document, Types } from "mongoose";

export interface IParent extends Document {
  name: string;
  email: string;
  contactNo: string;
  whatsappNo?: string;
  child: Types.ObjectId[];
}

const parentSchema = new Schema<IParent>(
  {
    name: {
      type: String,
      required: [true, "Parent name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    whatsappNo: {
      type: String,
      trim: true,
    },
    child: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Parent = model<IParent>("Parent", parentSchema);
