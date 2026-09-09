import { ParentsRepository } from "./parents.repository.js";
import { IAuthServiceGateway } from "../auth/auth.interface.js"; // Strictly importing the decoupled interface contract
import { IParent } from "./parents.model.js";
import logger from "../../utils/logger.js";
import { ApiError } from "../../utils/ApiError.js";
import mongoose, { Types } from "mongoose";

export class ParentsService {
  private parentRepo: ParentsRepository;
  private authGateway: IAuthServiceGateway; // The contract blueprint for your security layer

  // Injected at runtime construction to achieve maximum architectural decoupling
  constructor(parentRepo: ParentsRepository, authGateway: IAuthServiceGateway) {
    this.parentRepo = parentRepo;
    this.authGateway = authGateway;
  }

  async createParent(data: Partial<IParent>) {
    logger.info(
      `[ParentsService] Attempting to create parent profile for: ${data.email}`,
    );

    // 1. Establish an isolated data session context
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 2. Persist the parent metadata layout inside this session instance
      // Note: Ensure your parentRepo.create accepts an optional session parameter
      const parent = await this.parentRepo.create(data, { session });

      // 3. Command the security features engine using the explicit interface contract gateway
      await this.authGateway.createSystemIdentity(
        {
          email: parent.email,
          role: "PARENT", // Explicitly dictates the access role enum
          userId: parent._id as mongoose.Types.ObjectId,
          userModel: "Parent", // Tells the polymorphic layer which table to read
        },
        session,
      );

      // 4. Commit data alterations if both functions complete securely
      await session.commitTransaction();
      logger.info(
        `[ParentsService] Successfully created parent profile and identity credentials with ID: ${parent._id}`,
      );

      return parent;
    } catch (error: any) {
      // 5. Rollback data changes immediately to avoid partial "ghost documents"
      await session.abortTransaction();
      logger.error(
        `[ParentsService] Transaction sequence failed. Database reverted safely. Error: ${error.message}`,
      );
      throw new ApiError(
        500,
        `Parent profile and login identity registration process failed: ${error.message}`,
      );
    } finally {
      // 6. Secure termination of execution loops
      session.endSession();
    }
  }

  async getAllParents() {
    logger.info("[ParentsService] Fetching all parent records");
    return await this.parentRepo.findAll();
  }

  async getParentById(id: Types.ObjectId) {
    logger.info(`[ParentsService] Fetching parent by ID: ${id}`);
    const parent = await this.parentRepo.findById(id);
    if (!parent) {
      throw new ApiError(
        404,
        "Parent account profile matching this identifier was not found.",
      );
    }
    return parent;
  }

  async updateParent(id: Types.ObjectId, data: Partial<IParent>) {
    logger.info(`[ParentsService] Request received to update parent ID: ${id}`);
    const updatedParent = await this.parentRepo.update(id, data);
    if (!updatedParent) {
      throw new ApiError(404, "Parent profile target update entity not found.");
    }
    logger.info(`[ParentsService] Profile updated successfully for ID: ${id}`);
    return updatedParent;
  }

  async deleteParent(id: Types.ObjectId) {
    logger.info(
      `[ParentsService] Initializing drop routine for parent profile ID: ${id}`,
    );
    const deletedParent = await this.parentRepo.delete(id);
    if (!deletedParent) {
      throw new ApiError(
        404,
        "Target parent architecture file instance cannot be found to delete.",
      );
    }
    logger.info(
      `[ParentsService] Dropped parent profile index identity: ${id}`,
    );
    return deletedParent;
  }

  async getParentByStudent(studentId: Types.ObjectId) {
    logger.info(
      `[ParentsService] Running child index query lookup context for student ID: ${studentId}`,
    );
    return await this.parentRepo.getParentByStudent(studentId);
  }
}
