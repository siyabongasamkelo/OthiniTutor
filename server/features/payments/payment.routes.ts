import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  initializePaymentSchema,
  getPaymentsByStudentSchema,
  manualReceiptUploadSchema,
} from "./payment.validation.js";

const router = Router();
const controller = new PaymentController();

// Secure programmatic payment generation endpoint
router
  .route("/checkout")
  .post(validate(initializePaymentSchema), controller.checkout);

// Manual proof fallback loop tracking path entry route
router
  .route("/manual-proof")
  .post(validate(manualReceiptUploadSchema), controller.uploadManualReceipt);

// Ledger pipeline verification lookup path configuration
router
  .route("/student/:studentId")
  .get(validate(getPaymentsByStudentSchema), controller.getByStudent);

// Asynchronous high-priority background webhook channel endpoint
// Important Note: PayFast alerts bypass standard client validation tokens
router.route("/webhook").post(controller.handleWebhook);

export default router;
