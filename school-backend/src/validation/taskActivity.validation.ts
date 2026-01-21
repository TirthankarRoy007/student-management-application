import Joi from "joi";
import { ActivityType } from "../models/TaskActivity.js";

export const logActivitySchema = Joi.object({
  subjectId: Joi.string().uuid().required(),
  taskId: Joi.string().uuid().allow(null), // Can be null if it's generic subject study
  activityType: Joi.string().valid(...Object.values(ActivityType)).required(),
  minutesSpent: Joi.number().integer().min(1).required(),
  activityDate: Joi.number().integer().required(), // Epoch for the day
  activityTime: Joi.number().integer().required(), // Exact epoch
});
