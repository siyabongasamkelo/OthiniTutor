import { Request, Response, NextFunction } from 'express';
import { StudentService } from './students.services.js';
import logger from '../../utils/logger.js';

export class StudentController {

  // ==========================================================================
  // 1. POST: REGISTER NEW STUDENT
  // ==========================================================================
  /**
   * Express handler to execute a new student enrollment process.
   * Returns a sanitized, adapted response object.
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info(`🎮 [StudentController] Incoming POST request to register a student`);
    try {
      // The body has already been intercepted and validated by our Zod middleware layer
      const sanitizedPayload = req.body;
      
      const newlyRegisteredStudent = await StudentService.registerStudent(sanitizedPayload);
      
      logger.info(`✨ [StudentController] Registration cycle complete for ${newlyRegisteredStudent.fullName}. Sending response.`);
      res.status(201).json({
        success: true,
        message: "Student profile registered successfully into the platform database.",
        data: newlyRegisteredStudent // Already passed through the StudentAdapter inside the Service layer!
      });
    } catch (error) {
      logger.error(`❌ [StudentController] Registration endpoint threw an unhandled execution crash`);
      next(error);
    }
  }

  // ==========================================================================
  // 2. GET: FETCH ALL STUDENTS
  // ==========================================================================
  /**
   * Express handler to pull down all registered students list records.
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info(`🎮 [StudentController] Incoming GET request to retrieve all student entities`);
    try {
      const studentCollection = await StudentService.getAllStudents();
      
      logger.info(`✨ [StudentController] Successfully packaged ${studentCollection.length} adapted student payloads`);
      res.status(200).json({
        success: true,
        data: studentCollection
      });
    } catch (error) {
      logger.error(`❌ [StudentController] Fetch all students endpoint execution failure`);
      next(error);
    }
  }

  // ==========================================================================
  // 3. GET: FETCH SINGLE STUDENT PROFILE BY ID
  // ==========================================================================
  /**
   * Express handler to locate a single isolated student record using parameter IDs.
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    logger.info(`🎮 [StudentController] Incoming GET request for student profile lookup on ID: ${id}`);
    try {
      const studentProfile = await StudentService.getStudentById(id);
      
      logger.info(`✨ [StudentController] Target profile found and adapted for student ID: ${id}`);
      res.status(200).json({
        success: true,
        data: studentProfile
      });
    } catch (error) {
      logger.error(`❌ [StudentController] Single student lookup workflow threw an error execution`);
      next(error);
    }
  }

  // ==========================================================================
  // 4. PUT: UPDATE STUDENT RECORD
  // ==========================================================================
  /**
   * Express handler to modify specific properties of a student or their parent sub-document.
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    logger.info(`🎮 [StudentController] Incoming PUT request to modify properties for ID: ${id}`);
    try {
      const updatePayload = req.body;
      const updatedProfile = await StudentService.updateStudentProfile(id, updatePayload);
      
      logger.info(`✨ [StudentController] Modification complete for ID: ${id}. Dispatched adapted data.`);
      res.status(200).json({
        success: true,
        message: "Student record modifications applied successfully.",
        data: updatedProfile
      });
    } catch (error) {
      logger.error(`❌ [StudentController] Profile update endpoint encountered a compilation crash step`);
      next(error);
    }
  }

  // ==========================================================================
  // 5. DELETE: REMOVE STUDENT RECORD Completely
  // ==========================================================================
  /**
   * Express handler to safely strip out a student file document.
   */
  static async deleteStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    logger.info(`🎮 [StudentController] Incoming DELETE request to purge student tracking file ID: ${id}`);
    try {
      await StudentService.removeStudent(id);
      
      logger.info(`✨ [StudentController] Data record cleanly dropped for target file ID: ${id}`);
      res.status(200).json({
        success: true,
        message: "Student profile dataset removed from the central system records successfully."
      });
    } catch (error) {
      logger.error(`❌ [StudentController] Deletion operational router step caught an execution crash`);
      next(error);
    }
  }

  // ==========================================================================
  // 6. GET: GATEKEEPER LIVE DOOR MANIFEST (Dashboard Door-Check Screen)
  // ==========================================================================
  /**
   * Express handler to pull a checklist manifest sorted alphabetically, 
   * supporting optional real-time search queries used right at the door of Tugela High.
   */
  static async getDoorCheckList(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Read optional search term out of route params query strings (e.g. ?search=Sanele)
    const searchQuery = req.query.search as string | undefined;
    logger.info(`🎮 [StudentController] Incoming Gatekeeper query. Term signature: "${searchQuery || 'NONE - FULL LIST'}"`);
    try {
      const doorCheckManifest = await StudentService.getGatekeeperDoorList(searchQuery);
      
      logger.info(`✨ [StudentController] Calculated door checklist payload package. Found ${doorCheckManifest.length} records.`);
      res.status(200).json({
        success: true,
        data: doorCheckManifest
      });
    } catch (error) {
      logger.error(`❌ [StudentController] Gatekeeper check manifest engine execution failure`);
      next(error);
    }
  }

  // ==========================================================================
  // 7. GET: FETCH ROSTER FILTERED BY SCHOOL INSTANCE
  // ==========================================================================
  static async getBySchool(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { schoolName } = req.params;
    logger.info(`🎮 [StudentController] Incoming query filtering roster by institution: "${schoolName}"`);
    try {
      const schoolRoster = await StudentService.getRosterBySchool(schoolName);
      res.status(200).json({
        success: true,
        data: schoolRoster
      });
    } catch (error) {
      logger.error(`❌ [StudentController] School filtering roster route encountered an error loop`);
      next(error);
    }
  }

  // ==========================================================================
  // 8. GET: FETCH ROSTER FILTERED BY GRADE LAYER
  // ==========================================================================
  static async getByGrade(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { grade } = req.params;
    logger.info(`🎮 [StudentController] Incoming query filtering class entries by grade tier: "${grade}"`);
    try {
      const gradeRoster = await StudentService.getRosterByGrade(grade);
      res.status(200).json({
        success: true,
        data: gradeRoster
      });
    } catch (error) {
      logger.error(`❌ [StudentController] Grade operational filter endpoint returned a execution failure`);
      next(error);
    }
  }
}