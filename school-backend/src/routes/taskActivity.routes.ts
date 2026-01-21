import { Router } from "express";
import TaskActivityController from "../controllers/taskActivity.controller.js";
import { authenticateJwt } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { logActivitySchema } from "../validation/taskActivity.validation.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", validate(logActivitySchema), TaskActivityController.logActivity);
router.get("/", TaskActivityController.getActivities);

export default router;
