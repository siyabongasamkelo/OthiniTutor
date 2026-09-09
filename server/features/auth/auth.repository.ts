import { Auth, IAuth } from "./auth.model.js";
import { Types } from "mongoose";

export class AuthRepository {
  async registerIdentity(data: Partial<IAuth>): Promise<IAuth> {
    return await Auth.create(data);
  }

  async findByEmail(email: string): Promise<IAuth | null> {
    return await Auth.findOne({ email }).populate("userId");
  }

  async setOtpCode(
    email: string,
    code: string,
    expiry: Date,
  ): Promise<IAuth | null> {
    return await Auth.findOneAndUpdate(
      { email },
      { otpCode: code, otpExpiresAt: expiry },
      { new: true },
    );
  }

  async clearOtpCode(email: string): Promise<IAuth | null> {
    return await Auth.findOneAndUpdate(
      { email },
      { otpCode: null, otpExpiresAt: null },
      { new: true },
    );
  }

  async updateAccountStatus(
    id: Types.ObjectId,
    activeState: boolean,
  ): Promise<IAuth | null> {
    return await Auth.findByIdAndUpdate(
      id,
      { isActive: activeState },
      { new: true },
    );
  }
}
