import { TutorRepository } from "./tutors.repository.js";
import { ITutor } from "./tutors.model.js";
import logger from "../../utils/logger.js";
import { ApiError } from "../../utils/ApiError.js";
import { Types } from "mongoose";

const repo = new TutorRepository();

export class TutorService {
  async registerTutor(data: Partial<ITutor>) {
    logger.info(`Attempting to register tutor with email: ${data.email}`);
    const tutor = await repo.create(data);
    logger.info(`Tutor successfully created with ID: ${tutor._id}`);
    return tutor;
  }

  async getTutorById(id: Types.ObjectId) {
    const tutor = await repo.findById(id);
    if (!tutor) throw new ApiError(404, "Requested Tutor profile not found");
    return tutor;
  }

  async getAllTutors() {
    return await repo.findAll();
  }

  async updateTutor(id: Types.ObjectId, data: Partial<ITutor>) {
    logger.info(`Updating tutor profiling data for ID: ${id}`);
    const updated = await repo.update(id, data);
    if (!updated)
      throw new ApiError(404, "Tutor profile update target not found");
    return updated;
  }

  async removeTutor(id: Types.ObjectId) {
    logger.warn(`Deleting tutor profile data entry for ID: ${id}`);
    const deleted = await repo.delete(id);
    if (!deleted)
      throw new ApiError(404, "Tutor profile deletion target not found");
    return deleted;
  }

  async fetchParentContacts(studentId: Types.ObjectId) {
    logger.info(`Fetching parent details linked to Student ID: ${studentId}`);
    const result = await repo.getParentByStudent(studentId);
    if (!result || result.length === 0)
      throw new ApiError(404, "No parent data found for this student");
    return result[0];
  }
}
