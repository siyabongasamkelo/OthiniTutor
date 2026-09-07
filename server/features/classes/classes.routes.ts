import { Router } from "express";
import { ClassesController } from "./classes.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createClassSchema,
  classIdParamSchema,
  filterQuerySchema,
} from "./classes.validation.js";

const router = Router();
const controller = new ClassesController();

router
  .route("/")
  .post(validate(createClassSchema), controller.create)
  .get(validate(filterQuerySchema), controller.getClasses);

router
  .route("/:id")
  .get(validate(classIdParamSchema), controller.getById)
  .put(validate(classIdParamSchema), controller.update)
  .delete(validate(classIdParamSchema), controller.delete);

export default router;
