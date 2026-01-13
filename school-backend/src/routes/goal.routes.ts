import { Router } from "express";
import GoalController from "../controllers/goal.controller.js";
import { authenticateJwt } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createGoalSchema,
  updateGoalSchema,
} from "../validation/goal.validation.js";

const router = Router();

// All goal routes are protected
router.use(authenticateJwt);

router.post("/", validate(createGoalSchema), GoalController.createGoal);
router.get("/", GoalController.getMyGoals);
router.put("/:id", validate(updateGoalSchema), GoalController.updateGoal);
router.delete("/:id", GoalController.deleteGoal);

export default router;
