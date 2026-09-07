import { IPayment } from "./payment.model.js";

export interface CleanPaymentResponse {
  paymentId: string;
  studentId: string;
  guardianId: string;
  amount: number;
  className: string;
  status: string;
  method: string;
  paymentReference: string;
  proofImageUrl?: string;
  transactionTimestamp: Date;
}

export class PaymentAdapter {
  static toResponse(payment: IPayment): CleanPaymentResponse {
    return {
      paymentId: (payment._id as any).toString(),
      studentId: payment.student.toString(),
      guardianId: payment.guardian.toString(),
      amount: payment.amount,
      className: payment.className,
      status: payment.paymentStatus,
      method: payment.paymentType,
      paymentReference: payment.reference,
      proofImageUrl: payment.receiptImage || undefined,
      transactionTimestamp: payment.createdAt,
    };
  }

  static toResponseCollection(payments: IPayment[]): CleanPaymentResponse[] {
    return payments.map((p) => this.toResponse(p));
  }
}
