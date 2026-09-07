import { ParentsRepository } from "./parents.repository.js";
import { IParent } from "./parents.model.js";
import logger from "../../utils/logger.js";
import { ApiError } from "../../utils/ApiError.js";
import { Types } from "mongoose";

const parentRepo = new ParentsRepository();

export class ParentsService {
  async createParent(data: Partial<IParent>) {
    logger.info(
      `[ParentsService] Attempting to create parent profile for: ${data.email}`,
    );
    const parent = await parentRepo.create(data);
    logger.info(
      `[ParentsService] Successfully created parent with ID: ${parent._id}`,
    );
    return parent;
  }

  async getAllParents() {
    logger.info("[ParentsService] Fetching all parent records");
    return await parentRepo.findAll();
  }

  async getParentById(id: Types.ObjectId) {
    logger.info(`[ParentsService] Fetching parent by ID: ${id}`);
    const parent = await parentRepo.findById(id);
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
    const updatedParent = await parentRepo.update(id, data);
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
    const deletedParent = await parentRepo.delete(id);
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
    return await parentRepo.getParentByStudent(studentId);
  }
}
