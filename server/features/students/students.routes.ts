import { Router, Request, Response, NextFunction } from "express";
import { StudentController } from "./students.controller.js";
import {
  createStudentSchema,
  updateStudentSchema,
} from "./students.validation.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../utils/logger.js";
import { validate } from "../../middleware/validate.middleware.js"
const router = Router();

// ==========================================================================
// 🛡️ REUSABLE INLINE ZOD VALIDATION INTERCEPTOR MIDDLEWARE
// ==========================================================================
// ==========================================================================
// 🛣️ HTTP API ROUTING BOUNDARIES MAPPINGS
// ==========================================================================

/**
 * @route   POST /api/students
 * @desc    Registers a brand new student profile file inside system tracking records.
 */
router.post(
  "/",
  validate(createStudentSchema),
  StudentController.register,
);

/**
 * @route   GET /api/students
 * @desc    Pulls master roster tracking file listings across all registered divisions.
 */
router.get("/", StudentController.getAll);

/**
 * @route   GET /api/students/door-check
 * @desc    The central operational Gatekeeper pipeline endpoint used right at classroom entrances.
 *          Supports real-time lookup filters passed down query lines: /api/students/door-check?search=Sanele
 */
router.get("/door-check", StudentController.getDoorCheckList);

/**
 * @route   GET /api/students/id/:id
 * @desc    Locates a single isolated tracking card profile using specific database document tokens.
 */
router.get("/id/:id", StudentController.getById);

/**
 * @route   PUT /api/students/id/:id
 * @desc    Applies delta modifications across single fields or embedded parent sub-documents.
 */
router.put(
  "/id/:id",
  validate(updateStudentSchema),
  StudentController.update,
);

/**
 * @route   DELETE /api/students/id/:id
 * @desc    Wipes an active student profile card completely out of system storage tracking logs.
 */
router.delete("/id/:id", StudentController.deleteStudent);

/**
 * @route   GET /api/students/school/:schoolName
 * @desc    Roster sorting engine pulling dataset profiles grouped explicitly by physical high school limits.
 */
router.get("/school/:schoolName", StudentController.getBySchool);

/**
 * @route   GET /api/students/grade/:grade
 * @desc    Roster sorting engine pulling dataset profiles grouped explicitly by educational grade divisions.
 */
router.get("/grade/:grade", StudentController.getByGrade);

export default router;
