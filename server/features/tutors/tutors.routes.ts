import { Router } from "express";
import { TutorController } from "./tutors.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createTutorZodSchema,
  updateTutorZodSchema,
  tutorIdParamSchema,
  studentIdParamSchema,
} from "./tutors.validation.js";

const router = Router();
const controller = new TutorController();

router
  .route("/")
  .post(validate(createTutorZodSchema), controller.create)
  .get(controller.getAll);

router
  .route("/:id")
  .get(validate(tutorIdParamSchema), controller.getById)
  .put(validate(updateTutorZodSchema), controller.update)
  .delete(validate(tutorIdParamSchema), controller.delete);

router
  .route("/parent-lookup/:studentId")
  .get(validate(studentIdParamSchema), controller.getParentDetails);

export default router;
