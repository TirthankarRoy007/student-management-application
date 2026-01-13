import Joi from "joi";
import { GoalTargetType } from "../models/DailyGoal.js";

export const createGoalSchema = Joi.object({
  subjectId: Joi.string().uuid().required(),
  targetType: Joi.string()
    .valid(...Object.values(GoalTargetType))
    .required(),
  targetValue: Joi.number().integer().min(1).required(),
});

export const updateGoalSchema = Joi.object({
  targetType: Joi.string().valid(...Object.values(GoalTargetType)),
  targetValue: Joi.number().integer().min(1),
}).min(1); // at least one field required
