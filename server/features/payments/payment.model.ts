import { Schema, model, Document, Types } from "mongoose";

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
}

export enum PaymentType {
  PAYFAST = "PAYFAST",
  CASH_SEND = "CASH_SEND",
}

// Sub-document for secure tracking of gateway details
interface IPayFastMetadata {
  pfPaymentId?: string;
  signature?: string;
  token?: string;
}

export interface IPayment extends Document {
  student: Types.ObjectId;
  guardian: Types.ObjectId;
  amount: number;
  className: string;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  reference: string;
  receiptImage?: string;
  payfastMetadata?: IPayFastMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const payfastMetadataSchema = new Schema<IPayFastMetadata>(
  {
    pfPaymentId: { type: String, trim: true },
    signature: { type: String, trim: true },
    token: { type: String, trim: true },
  },
  { _id: false },
);

const paymentSchema = new Schema<IPayment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student reference is required."],
    },
    guardian: {
      type: Schema.Types.ObjectId,
      ref: "Parent",
      required: [true, "Guardian reference is required."],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required."],
      min: [1, "Amount must be greater than 0 ZAR."],
    },
    className: {
      type: String,
      required: [true, "Class name target identifier is required."],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
    },
    paymentType: {
      type: String,
      enum: Object.values(PaymentType),
      default: PaymentType.PAYFAST,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    receiptImage: {
      type: String,
      trim: true,
    },
    payfastMetadata: {
      type: payfastMetadataSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
