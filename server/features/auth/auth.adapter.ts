import { IAuth } from "./auth.model.js";

export interface LoginSuccessResponse {
  token: string;
  user: {
    authId: string;
    profileId: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

export class AuthAdapter {
  static toLoginResponse(
    authDoc: IAuth,
    signedJwtToken: string,
  ): LoginSuccessResponse {
    return {
      token: signedJwtToken,
      user: {
        authId: (authDoc._id as any).toString(),
        profileId: authDoc.userId.toString(),
        email: authDoc.email,
        role: authDoc.role,
        isActive: authDoc.isActive,
      },
    };
  }
}
