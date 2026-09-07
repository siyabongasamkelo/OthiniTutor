import { ClassesRepository } from "./classes.repository.js";
import { IClass } from "./classes.model.js";
import logger from "../../utils/logger.js";
import { ApiError } from "../../utils/ApiError.js";
import { Types } from "mongoose";

const classRepo = new ClassesRepository();

export class ClassesService {
  async createClass(data: Partial<IClass>) {
    logger.info(
      `[ClassesService] Creating new tutor class listing session: "${data.title}"`,
    );
    return await classRepo.create(data);
  }

  async getAllClasses() {
    logger.info("[ClassesService] Querying entire classes catalog index.");
    return await classRepo.findAll();
  }

  async getClassById(id: Types.ObjectId) {
    logger.info(`[ClassesService] Locating specific session profile: ${id}`);
    const classDoc = await classRepo.findById(id);
    if (!classDoc) {
      throw new ApiError(
        404,
        "Requested tutoring class profile entry could not be located.",
      );
    }
    return classDoc;
  }

  async updateClass(id: Types.ObjectId, data: Partial<IClass>) {
    logger.info(
      `[ClassesService] Appending data variations onto class sequence: ${id}`,
    );
    const updated = await classRepo.update(id, data);
    if (!updated) {
      throw new ApiError(
        404,
        "Tutoring session tracking identity target mismatch for update operation.",
      );
    }
    return updated;
  }

  async deleteClass(id: Types.ObjectId) {
    logger.warn(
      `[ClassesService] Dropping class index layout configuration profile: ${id}`,
    );
    const deleted = await classRepo.delete(id);
    if (!deleted) {
      throw new ApiError(
        404,
        "Target entity instance cannot be located to handle deletion context.",
      );
    }
    return deleted;
  }

  async searchByDate(dateString: string) {
    logger.info(
      `[ClassesService] Filtering catalog array metrics for Target Date: ${dateString}`,
    );
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(
        400,
        "Supplied parameter value matches an invalid datetime formatting string.",
      );
    }
    return await classRepo.getClassByDate(parsedDate);
  }

  async searchBySubject(subject: string) {
    logger.info(
      `[ClassesService] Running exact lookup sequence string for subject match: ${subject}`,
    );
    return await classRepo.getClassBySubject(subject);
  }

  async searchByLocation(location: string) {
    logger.info(
      `[ClassesService] Running lookup array matrix filtering sequence for target location: ${location}`,
    );
    return await classRepo.getClassByLocation(location);
  }
}
