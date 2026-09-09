import { Request, Response, NextFunction } from "express";
import { TutorService } from "./tutors.service.js";
import { TutorAdapter } from "./tutors.adapter.js";
import { Types } from "mongoose";

const service = new TutorService();

export class TutorController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.registerTutor(req.body);
      res
        .status(201)
        .json({ success: true, data: TutorAdapter.toClient(data) });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as unknown as Types.ObjectId;
      const data = await service.getTutorById(id);
      res
        .status(200)
        .json({ success: true, data: TutorAdapter.toClient(data) });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.getAllTutors();
      res
        .status(200)
        .json({ success: true, data: TutorAdapter.toClientList(data) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as unknown as Types.ObjectId;
      const data = await service.updateTutor(id, req.body);
      res
        .status(200)
        .json({ success: true, data: TutorAdapter.toClient(data) });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as unknown as Types.ObjectId;
      await service.removeTutor(id);
      res
        .status(200)
        .json({ success: true, message: "Tutor profile successfully deleted" });
    } catch (error) {
      next(error);
    }
  }

  async getParentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId as unknown as Types.ObjectId;
      const data = await service.fetchParentContacts(studentId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
