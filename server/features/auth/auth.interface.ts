import { ClientSession } from "mongoose";
import { UserRole } from "./auth.model.js"; // Import the enum straight from your model

export interface IAuthServiceGateway {
  createSystemIdentity(
    data: {
      email: string;
      role: UserRole; // 👈 Upgraded from string to the exact UserRole Enum
      userId: any;
      userModel: "Student" | "Parent" | "Tutor"; // 👈 Locked to your valid polymorphic collection strings
    },
    session?: ClientSession,
  ): Promise<any>;
}
