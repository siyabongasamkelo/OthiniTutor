import { Request, Response, NextFunction } from "express";
import { ParentsService } from "./parents.service.js";
import { ParentsAdapter } from "./parents.adapter.ts";
import logger from "../../utils/logger.js";

const parentsService = new ParentsService();

export class ParentsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parent = await parentsService.createParent(req.body);
      const adapted = ParentsAdapter.toResponse(parent);
      res
        .status(201)
        .json({
          success: true,
          message: "Parent profile built successfully.",
          data: adapted,
        });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parents = await parentsService.getAllParents();
      const adapted = ParentsAdapter.toResponseCollection(parents);
      res
        .status(200)
        .json({ success: true, count: adapted.length, data: adapted });
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
      const parentId = (req.params as any).id;
      const parent = await parentsService.getParentById(parentId);
      res
        .status(200)
        .json({ success: true, data: ParentsAdapter.toResponse(parent) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parentId = (req.params as any).id;
      const updated = await parentsService.updateParent(parentId, req.body);
      res
        .status(200)
        .json({
          success: true,
          message: "Parent record synchronized.",
          data: ParentsAdapter.toResponse(updated),
        });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parentId = (req.params as any).id;
      await parentsService.deleteParent(parentId);
      res
        .status(200)
        .json({
          success: true,
          message: "Parent context record removed from system securely.",
        });
    } catch (error) {
      next(error);
    }
  }

  async getByStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const studentId = (req.params as any).studentId;
      const parents = await parentsService.getParentByStudent(studentId);
      res
        .status(200)
        .json({
          success: true,
          data: ParentsAdapter.toResponseCollection(parents),
        });
    } catch (error) {
      next(error);
    }
  }
}
