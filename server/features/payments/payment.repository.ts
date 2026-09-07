import { Payment, IPayment, PaymentStatus } from "./payment.model.js";
import { Types } from "mongoose";

export class PaymentRepository {
  async create(data: Partial<IPayment>): Promise<IPayment> {
    return await Payment.create(data);
  }

  async findById(id: Types.ObjectId): Promise<IPayment | null> {
    return await Payment.findById(id).populate("student").populate("guardian");
  }

  async findByReference(reference: string): Promise<IPayment | null> {
    return await Payment.findOne({ reference });
  }

  async updateStatus(
    reference: string,
    status: PaymentStatus,
    gatewayData?: any,
  ): Promise<IPayment | null> {
    const updatePayload: any = { paymentStatus: status };
    if (gatewayData) {
      updatePayload.payfastMetadata = gatewayData;
    }
    return await Payment.findOneAndUpdate({ reference }, updatePayload, {
      new: true,
      runValidators: true,
    });
  }

  async getPaymentsByStudent(studentId: Types.ObjectId): Promise<IPayment[]> {
    return await Payment.find({ student: studentId }).sort({ createdAt: -1 });
  }

  async getPaymentsByGuardian(guardianId: Types.ObjectId): Promise<IPayment[]> {
    return await Payment.find({ guardian: guardianId }).sort({ createdAt: -1 });
  }
}
