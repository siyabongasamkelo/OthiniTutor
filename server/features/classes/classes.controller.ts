import { Request, Response, NextFunction } from "express";
import { ClassesService } from "./classes.service.js";
import { ClassesAdapter } from "./classes.adapter.js";
import { Types } from "mongoose";

const classesService = new ClassesService();

export class ClassesController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newClass = await classesService.createClass(req.body);
      res.status(201).json({
        success: true,
        message: "Tutoring class profile instance structured successfully.",
        data: ClassesAdapter.toResponse(newClass),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const classId = new Types.ObjectId((req.params as any).id);
      const classDoc = await classesService.getClassById(classId);
      res
        .status(200)
        .json({ success: true, data: ClassesAdapter.toResponse(classDoc) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classId = new Types.ObjectId((req.params as any).id);
      const updated = await classesService.updateClass(classId, req.body);
      res.status(200).json({
        success: true,
        message: "Class parameters updated seamlessly.",
        data: ClassesAdapter.toResponse(updated),
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classId = new Types.ObjectId((req.params as any).id);
      await classesService.deleteClass(classId);
      res
        .status(200)
        .json({
          success: true,
          message: "Class session cleared from active logs.",
        });
    } catch (error) {
      next(error);
    }
  }

  async getClasses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { date, subject, location } = req.query as Record<string, string>;
      let results;

      if (date) {
        results = await classesService.searchByDate(date);
      } else if (subject) {
        results = await classesService.searchBySubject(subject);
      } else if (location) {
        results = await classesService.searchByLocation(location);
      } else {
        results = await classesService.getAllClasses();
      }

      res.status(200).json({
        success: true,
        count: results.length,
        data: ClassesAdapter.toResponseCollection(results),
      });
    } catch (error) {
      next(error);
    }
  }
}
