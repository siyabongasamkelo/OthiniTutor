import { Request, Response, NextFunction } from "express";
import { StudentService } from "./students.services";

export class StudentsController {
  private studentService: StudentService;

  // Injected at runtime configuration level to preserve maximum architectural range
  constructor(studentService: StudentService) {
    this.studentService = studentService;
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Data is already 100% clean and verified here by your Zod middleware shield
      const adaptedData = await this.studentService.registerStudent(req.body);

      res.status(201).json({
        success: true,
        message:
          "High school student tracking account profile synchronized successfully.",
        data: adaptedData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.studentService.getAllStudents();
      res.status(200).json({
        success: true,
        count: data.length,
        data,
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
      // const { id } = req.params;
      const id = (req.params as any).id;

      const data = await this.studentService.getStudentById(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { id } = req.params;
      const id = (req.params as any).id;
      const data = await this.studentService.updateStudentProfile(id, req.body);

      res.status(200).json({
        success: true,
        message: "Student metrics updated successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const { id } = req.params;
      const id = (req.params as any).id;
      await this.studentService.removeStudent(id);

      res.status(200).json({
        success: true,
        message: "Student tracking index line deleted safely.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getGatekeeperManifest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Safely extract the optional text filter query from the gatekeeper door monitor screens
      const searchQuery = req.query.searchQuery as string | undefined;
      const data = await this.studentService.getGatekeeperDoorList(searchQuery);

      res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySchoolRoster(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const { schoolName } = req.params;
      const schoolName = (req.params as any).schoolName;
      const data = await this.studentService.getRosterBySchool(schoolName);

      res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
