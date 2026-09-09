import { Parent, IParent } from "./parents.model.js";
import { Types } from "mongoose";

export class ParentsRepository {
  async create(
    data: Partial<IParent>,
    options?: { session: any },
  ): Promise<IParent> {
    return await Parent.create(data);
  }

  async findAll(): Promise<IParent[]> {
    return await Parent.find().populate("child");
  }

  async findById(id: Types.ObjectId): Promise<IParent | null> {
    return await Parent.findById(id).populate("child");
  }

  async update(
    id: Types.ObjectId,
    data: Partial<IParent>,
  ): Promise<IParent | null> {
    return await Parent.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("child");
  }

  async delete(id: Types.ObjectId): Promise<IParent | null> {
    return await Parent.findByIdAndDelete(id);
  }

  async getParentByStudent(studentId: Types.ObjectId): Promise<IParent[]> {
    return await Parent.find({ child: studentId }).populate("child");
  }
}
