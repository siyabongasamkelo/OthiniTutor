import { Schema, model, Document, Types } from "mongoose";

export interface IPricing {
  singleLessonPrice: number;
  monthlyLessonPrice: number;
  singleTermPrice: number;
  yearlyPrice: number;
}

export interface ISocials {
  facebookLink?: string;
  otherSocialMediaLink?: string;
  websiteLink?: string;
}

export interface ITutor extends Document {
  fullName: string;
  email: string;
  contactNo: string;
  whatsAppNo?: string;
  subjects: string[];
  picture?: string;
  payfastApiKey?: string;
  pricing: IPricing;
  nameOfSchool?: string; // School where their students usually come from
  socials: ISocials;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pricingSchema = new Schema<IPricing>(
  {
    singleLessonPrice: { type: Number, required: true, min: 0 },
    monthlyLessonPrice: { type: Number, required: true, min: 0 },
    singleTermPrice: { type: Number, required: true, min: 0 },
    yearlyPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const socialsSchema = new Schema<ISocials>(
  {
    facebookLink: { type: String, trim: true },
    otherSocialMediaLink: { type: String, trim: true },
    websiteLink: { type: String, trim: true },
  },
  { _id: false },
);

const tutorSchema = new Schema<ITutor>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    contactNo: { type: String, required: true, trim: true },
    whatsAppNo: { type: String, trim: true },
    subjects: { type: [String], required: true, default: [] },
    picture: { type: String, trim: true },
    payfastApiKey: { type: String, trim: true },
    pricing: { type: pricingSchema, required: true },
    nameOfSchool: { type: String, trim: true },
    socials: { type: socialsSchema, default: {} },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TutorModel = model<ITutor>("Tutor", tutorSchema);
