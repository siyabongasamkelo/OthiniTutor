import { Router } from "express";
import { ParentsController } from "./parents.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createParentSchema,
  updateParentSchema,
  getParentByIdSchema,
  getParentByStudentSchema,
} from "./parents.validation.js";

const router = Router();
const controller = new ParentsController();

router
  .route("/")
  .post(validate(createParentSchema), controller.create)
  .get(controller.getAll);

router
  .route("/:id")
  .get(validate(getParentByIdSchema), controller.getById)
  .put(validate(updateParentSchema), controller.update)
  .delete(validate(getParentByIdSchema), controller.delete);

router
  .route("/student/:studentId")
  .get(validate(getParentByStudentSchema), controller.getByStudent);

export default router;
