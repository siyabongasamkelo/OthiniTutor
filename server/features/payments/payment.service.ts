import { PaymentRepository } from "./payment.repository.js";
import { IPayment, PaymentStatus, PaymentType } from "./payment.model.js";
import logger from "../../utils/logger.js";
import { ApiError } from "../../utils/ApiError.js";
import crypto from "crypto";
import { Types } from "mongoose";

const paymentRepo = new PaymentRepository();

export class PaymentService {
  private generateReference(): string {
    return `TUT-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  }

  private generatePayFastSignature(
    data: Record<string, string>,
    passphrase?: string,
  ): string {
    let pfParamString = "";
    Object.keys(data)
      .sort()
      .forEach((key) => {
        if (data[key] !== "") {
          pfParamString += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
        }
      });

    if (passphrase) {
      pfParamString += `passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
    } else {
      pfParamString = pfParamString.substr(0, pfParamString.length - 1);
    }

    return crypto.createHash("md5").update(pfParamString).digest("hex");
  }

  async initializePayment(data: Partial<IPayment>) {
    const reference = this.generateReference();
    logger.info(
      `[PaymentService] Initializing transaction sequence for reference: ${reference}`,
    );

    const newPayment = await paymentRepo.create({
      ...data,
      reference,
      paymentStatus: PaymentStatus.PENDING,
    });

    if (data.paymentType === PaymentType.CASH_SEND) {
      logger.warn(
        `[PaymentService] Manual Cash Send path initialized for reference: ${reference}`,
      );
      return { payment: newPayment, checkoutUrl: null };
    }

    // Secure PayFast variable construction
    const merchantId = process.env.PAYFAST_MERCHANT_ID || "10000100"; // Sandbox defaults
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a";
    const passphrase = process.env.PAYFAST_PASSPHRASE;

    const basePayFastUrl =
      process.env.NODE_ENV === "production"
        ? "https://payfast.co.za"
        : "https://payfast.co.za";

    const payfastData: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success?ref=${reference}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/cancel?ref=${reference}`,
      notify_url: `${process.env.BACKEND_API_URL || "http://localhost:5000/api/v1/payments"}/webhook`,
      m_payment_id: reference,
      amount: newPayment.amount.toFixed(2),
      item_name: `Tuition Fees for Class: ${newPayment.className}`,
    };

    const signature = this.generatePayFastSignature(payfastData, passphrase);
    payfastData["signature"] = signature;

    const queryParams = new URLSearchParams(payfastData).toString();
    const secureCheckoutUrl = `${basePayFastUrl}?${queryParams}`;

    logger.info(
      `[PaymentService] MD5 cryptographic token secure mapping built successfully for reference: ${reference}`,
    );
    return { payment: newPayment, checkoutUrl: secureCheckoutUrl };
  }

  async processWebhook(payload: any) {
    const reference = payload.m_payment_id;
    const pfPaymentId = payload.pf_payment_id;
    const paymentStatus = payload.payment_status;

    logger.info(
      `[PaymentService] Incoming Webhook received from PayFast engine for ref: ${reference}`,
    );

    const existingPayment = await paymentRepo.findByReference(reference);
    if (!existingPayment) {
      throw new ApiError(
        404,
        "Target transaction trace reference record matching Payfast token not found.",
      );
    }

    if (existingPayment.paymentStatus === PaymentStatus.SUCCESSFUL) {
      logger.info(
        `[PaymentService] Context reference ${reference} already marked successful. Skipping duplicate logic.`,
      );
      return existingPayment;
    }

    let statusToUpdate = PaymentStatus.FAILED;
    if (paymentStatus === "COMPLETE") {
      statusToUpdate = PaymentStatus.SUCCESSFUL;
      logger.info(
        `[PaymentService] Webhook confirmed payment complete for ref: ${reference}`,
      );
      // Proactive: Insert child alerts notification logic here when needed
    } else {
      logger.warn(
        `[PaymentService] Webhook rejected or cancelled transaction for ref: ${reference}. Reason: ${paymentStatus}`,
      );
    }

    return await paymentRepo.updateStatus(reference, statusToUpdate, {
      pfPaymentId,
      signature: payload.signature,
    });
  }

  async submitCashReceipt(data: Partial<IPayment>) {
    const reference = this.generateReference();
    logger.info(
      `[PaymentService] Manual processing receipt check initialized: ${reference}`,
    );

    return await paymentRepo.create({
      ...data,
      reference,
      paymentType: PaymentType.CASH_SEND,
      paymentStatus: PaymentStatus.PENDING,
    });
  }

  async fetchStudentPayments(studentId: Types.ObjectId) {
    logger.info(
      `[PaymentService] Extracting all historical payment ledger lines for student: ${studentId}`,
    );
    return await paymentRepo.getPaymentsByStudent(studentId);
  }
}
