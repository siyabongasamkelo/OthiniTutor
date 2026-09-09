import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  requestOtpSchema,
  verifyOtpSchema,
  registerIdentitySchema,
} from "./auth.validation.js";

const router = Router();
const controller = new AuthController();

// Route for sending the 6-digit token to the user inbox
router
  .route("/request-otp")
  .post(validate(requestOtpSchema), controller.requestOtp);

// Route for validating the entered code and logging the user in
router
  .route("/verify-otp")
  .post(validate(verifyOtpSchema), controller.verifyOtp);

// Internal helper orchestration pipeline endpoint to register system profiles
router
  .route("/register-identity")
  .post(validate(registerIdentitySchema), controller.registerInternalIdentity);

export default router;
