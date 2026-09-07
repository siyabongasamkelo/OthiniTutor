import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service.js";
import { PaymentAdapter } from "./payment.adapter.js";
import logger from "../../utils/logger.js";
import { Types } from "mongoose";

const paymentService = new PaymentService();

export class PaymentController {
  async checkout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { payment, checkoutUrl } = await paymentService.initializePayment(
        req.body,
      );
      const adapted = PaymentAdapter.toResponse(payment);

      res.status(201).json({
        success: true,
        message: "Secure transaction tokenized successfully.",
        data: { ...adapted, checkoutUrl },
      });
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // PayFast sends webhooks as urlencoded POST payloads
      await paymentService.processWebhook(req.body);
      // PayFast requires an HTTP 200 OK structural line string back to shut off notifications cleanly
      res.status(200).send("OK");
    } catch (error) {
      logger.error(
        `[PaymentController Webhook Crash Error Exception]: ${error}`,
      );
      next(error);
    }
  }

  async uploadManualReceipt(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payment = await paymentService.submitCashReceipt(req.body);
      res.status(201).json({
        success: true,
        message:
          "Manual Cash Send proof submitted successfully for administrative audit approval.",
        data: PaymentAdapter.toResponse(payment),
      });
    } catch (error) {
      next(error);
    }
  }

  async getByStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = new Types.ObjectId((req.params as any).studentId);
      const history = await paymentService.fetchStudentPayments(studentId);
      res.status(200).json({
        success: true,
        data: PaymentAdapter.toResponseCollection(history),
      });
    } catch (error) {
      next(error);
    }
  }
}
