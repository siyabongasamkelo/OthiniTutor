import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { AuthAdapter } from "./auth.adapter.js";

const authService = new AuthService();

export class AuthController {
  async registerInternalIdentity(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const identity = await authService.createSystemIdentity(req.body);
      res.status(201).json({
        success: true,
        message:
          "Polymorphic login security wrapper configured successfully for user entity.",
        data: identity,
      });
    } catch (error) {
      next(error);
    }
  }

  async requestOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;
      await authService.requestLoginCode(email);
      res.status(200).json({
        success: true,
        message:
          "Secure 6-digit numeric login verification dispatch transmitted via Brevo relay.",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, otpCode } = req.body;
      const { account, sessionToken } = await authService.verifyLoginCode(
        email,
        otpCode,
      );
      const adaptedPayload = AuthAdapter.toLoginResponse(account, sessionToken);

      res.status(200).json({
        success: true,
        message:
          "Security code match confirmed. Dashboard authorization granted.",
        data: adaptedPayload,
      });
    } catch (error) {
      next(error);
    }
  }
}
