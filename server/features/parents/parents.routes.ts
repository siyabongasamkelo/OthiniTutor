import { Router } from "express";
import { ParentsController } from "./parents.controller.js";
import { ParentsService } from "./parents.service.js";
import { ParentsRepository } from "./parents.repository.js";
import { AuthService } from "../auth/auth.service.js"; // Concrete class injected at the routing entry point
import { validate } from "../../middleware/validate.middleware.js";
import {
  createParentSchema,
  updateParentSchema,
  getParentByIdSchema,
  getParentByStudentSchema,
} from "./parents.validation.js";

const router = Router();

// ==========================================================================
// 🚀 DECOUPLED INJECTION CONTAINER ROOT WIRING (Composition Root)
// ==========================================================================
const parentRepo = new ParentsRepository();
const authServiceConcrete = new AuthService();

// 1. Inject repo and auth service into the service container constructor
const parentsService = new ParentsService(parentRepo, authServiceConcrete);

// 2. Inject the fully initialized service into the controller 👈 This satisfies the structural argument!
const controller = new ParentsController(parentsService);

// ==========================================================================
// 🛤️ ENDPOINT ROUTING ENGINE MAPS
// ==========================================================================

router
  .route("/")
  .post(validate(createParentSchema), (req, res, next) =>
    controller.create(req, res, next),
  )
  .get((req, res, next) => controller.getAll(req, res, next));

router
  .route("/:id")
  .get(validate(getParentByIdSchema), (req, res, next) =>
    controller.getById(req, res, next),
  )
  .put(validate(updateParentSchema), (req, res, next) =>
    controller.update(req, res, next),
  )
  .delete(validate(getParentByIdSchema), (req, res, next) =>
    controller.delete(req, res, next),
  );

router
  .route("/student/:studentId")
  .get(validate(getParentByStudentSchema), (req, res, next) =>
    controller.getByStudent(req, res, next),
  );

export default router;
