import { AuthRepository } from "./auth.repository.js";
import { IAuth } from "./auth.model.js";
import logger from "../../utils/logger.js";
import { ApiError } from "../../utils/ApiError.js";
import sendEmail from "../../utils/sendEmail.js"; // Reusing your exact verified component
import jwt from "jsonwebtoken";
import crypto from "crypto";

const authRepo = new AuthRepository();

export class AuthService {
  private generateNumericOtp(): string {
    // Generates a cryptographically secure 6-digit numeric string
    return crypto.randomInt(100000, 999999).toString();
  }

  async createSystemIdentity(data: Partial<IAuth>) {
    logger.info(
      `[AuthService] Building system identity footprint for: ${data.email} as ${data.role}`,
    );
    return await authRepo.registerIdentity(data);
  }

  async requestLoginCode(email: string): Promise<void> {
    logger.info(
      `[AuthService] OTP code request submitted for email entry: ${email}`,
    );

    const account = await authRepo.findByEmail(email);
    if (!account) {
      throw new ApiError(
        404,
        "No registered account details found matching this email address.",
      );
    }

    if (!account.isActive) {
      throw new ApiError(
        403,
        "This tutor network account has been deactivated by system administrative controls.",
      );
    }

    const otp = this.generateNumericOtp();
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

    await authRepo.setOtpCode(email, otp, fiveMinutesFromNow);
    logger.info(
      `[AuthService] Secure OTP code generated and mapped for ${email}. Dispatching relay...`,
    );

    // Composing standard email output template using your Brevo structure parameters
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Your Local Tutor App Login Code</h2>
        <p>Hello,</p>
        <p>Use the secure 6-digit numeric verification code below to gain access into your dashboard panel. This token expires inside 5 minutes.</p>
        <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; border-radius: 5px; color: #2C3E50; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #7f8c8d;">If you did not request this login sequence pipeline, please safely disregard this email string notice.</p>
      </div>
    `;

    await sendEmail({
      to: account.email,
      subject: `${otp} is your secure verification login code`,
      text: `Your local tutor system security verification login entry code is: ${otp}`,
      html: emailHtml,
    });

    logger.info(
      `[AuthService] Brevo gateway successfully transmitted communication link pack to: ${email}`,
    );
  }

  async verifyLoginCode(email: string, code: string) {
    logger.info(
      `[AuthService] Verification code matching sequence evaluation routine triggered for: ${email}`,
    );

    const account = await authRepo.findByEmail(email);
    if (!account || !account.otpCode || !account.otpExpiresAt) {
      throw new ApiError(
        400,
        "No active credential validation window found matching this account context.",
      );
    }

    // Check expiration windows
    if (new Date() > account.otpExpiresAt) {
      await authRepo.clearOtpCode(email);
      throw new ApiError(
        401,
        "Provided authentication security code window has expired. Request a new login code.",
      );
    }

    // Verify code string match match precision
    if (account.otpCode !== code) {
      throw new ApiError(
        401,
        "Supplied verification credentials do not match database entry metrics.",
      );
    }

    // Secure cleanup of used values immediately upon validation approval
    await authRepo.clearOtpCode(email);
    logger.info(
      `[AuthService] Validation credentials verified successfully for account identity: ${email}`,
    );

    // Create tracking session tokens
    const jwtSecret =
      process.env.JWT_SECRET || "SUPER_SECRET_LOCAL_KEY_SOUTH_AFRICA_99";
    const sessionToken = jwt.sign(
      {
        authId: account._id,
        userId: account.userId,
        role: account.role,
      },
      jwtSecret,
      { expiresIn: "7d" }, // 7 Day active mobile session retention window
    );

    return { account, sessionToken };
  }
}
