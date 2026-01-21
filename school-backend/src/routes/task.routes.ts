import { Router } from "express";
import TaskController from "../controllers/task.controller.js";
import { authenticateJwt } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validation/task.validation.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", validate(createTaskSchema), TaskController.createTask);
router.get("/", TaskController.getMyTasks);
router.put("/:id", validate(updateTaskSchema), TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export default router;
