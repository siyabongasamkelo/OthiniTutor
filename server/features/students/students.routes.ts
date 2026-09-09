import { Router } from "express";
import { StudentsController } from "./students.controller.js";
import { StudentService } from "./students.services.js";
import { StudentRepository } from "./students.repository.js";
import { AuthService } from "../auth/auth.service.js"; // Concrete file imported strictly at composition root
import { validate } from "../../middleware/validate.middleware.js";
import {
  createStudentSchema,
  updateStudentSchema,
  studentQuerySchema,
} from "./students.validation.js";

const router = Router();

// ==========================================
// 🚀 DECOUPLED INJECTION CONTAINER ROOT WIRING
// ==========================================
const authServiceConcrete = new AuthService();

// Instantiating the decoupled constructor sequence containers
const studentService = new StudentService(
  StudentRepository,
  authServiceConcrete,
);
const controller = new StudentsController(studentService);

// ==========================================
// 🛤️ ENDPOINT ROUTING ENGINE MAPS
// ==========================================

// Base structural registration and complete list access pathway
router
  .route("/")
  .post(validate(createStudentSchema), (req, res, next) =>
    controller.create(req, res, next),
  )
  .get((req, res, next) => controller.getAll(req, res, next));

// Gatekeeper Classroom Door Monitor screening endpoint
router
  .route("/gatekeeper")
  .get(validate(studentQuerySchema), (req, res, next) =>
    controller.getGatekeeperManifest(req, res, next),
  );

// High School roster grouping segregation endpoint
router
  .route("/school/:schoolName")
  .get((req, res, next) => controller.getBySchoolRoster(req, res, next));

// Isolated singular profile modifications resource route parameters
router
  .route("/:id")
  .get((req, res, next) => controller.getById(req, res, next))
  .put(validate(updateStudentSchema), (req, res, next) =>
    controller.update(req, res, next),
  )
  .delete((req, res, next) => controller.delete(req, res, next));

export default router;
