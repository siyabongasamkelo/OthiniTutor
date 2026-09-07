import { ClassModel, IClass } from "./classes.model.js";
import { Types } from "mongoose";

export class ClassesRepository {
  async create(data: Partial<IClass>): Promise<IClass> {
    return await ClassModel.create(data);
  }

  async findAll(): Promise<IClass[]> {
    return await ClassModel.find().populate("tutor", "name email contactNo");
  }

  async findById(id: Types.ObjectId): Promise<IClass | null> {
    return await ClassModel.findById(id).populate(
      "tutor",
      "name email contactNo",
    );
  }

  async update(
    id: Types.ObjectId,
    data: Partial<IClass>,
  ): Promise<IClass | null> {
    return await ClassModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: Types.ObjectId): Promise<IClass | null> {
    return await ClassModel.findByIdAndDelete(id);
  }

  async getClassByDate(targetDate: Date): Promise<IClass[]> {
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    return await ClassModel.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("tutor", "name");
  }

  async getClassBySubject(subject: string): Promise<IClass[]> {
    return await ClassModel.find({
      subjects: { $regex: new RegExp(subject, "i") },
    }).populate("tutor", "name");
  }

  async getClassByLocation(location: string): Promise<IClass[]> {
    return await ClassModel.find({
      locationDetails: { $regex: new RegExp(location, "i") },
    }).populate("tutor", "name");
  }
}
