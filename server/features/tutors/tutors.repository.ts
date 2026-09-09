import { TutorModel, ITutor } from "./tutors.model.js";
import { Types } from "mongoose";

export class TutorRepository {
  async create(data: Partial<ITutor>): Promise<ITutor> {
    return await TutorModel.create(data);
  }

  async findById(id: Types.ObjectId): Promise<ITutor | null> {
    return await TutorModel.findById(id);
  }

  async findAll(): Promise<ITutor[]> {
    return await TutorModel.find();
  }

  async update(
    id: Types.ObjectId,
    data: Partial<ITutor>,
  ): Promise<ITutor | null> {
    return await TutorModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: Types.ObjectId): Promise<ITutor | null> {
    return await TutorModel.findByIdAndDelete(id);
  }

  /**
   * Fetches parent information using a student ID.
   * Assumes a 'students' collection exists with a 'parentId' linking to a 'parents' collection.
   */
  async getParentByStudent(studentId: Types.ObjectId): Promise<any[]> {
    return await TutorModel.aggregate([
      {
        $lookup: {
          from: "students",
          pipeline: [
            { $match: { _id: studentId } },
            {
              $lookup: {
                from: "parents",
                localField: "parentId",
                foreignField: "_id",
                as: "parentDetails",
              },
            },
            { $unwind: "$parentDetails" },
          ],
          as: "studentData",
        },
      },
      { $unwind: "$studentData" },
      {
        $project: {
          _id: 0,
          studentId: "$studentData._id",
          studentName: "$studentData.name",
          parent: "$studentData.parentDetails",
        },
      },
    ]);
  }
}
