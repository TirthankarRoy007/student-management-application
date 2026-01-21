import Joi from "joi";
import { TaskStatus } from "../models/Task.js";

export const createTaskSchema = Joi.object({
  subjectId: Joi.string().uuid().required(),
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().allow(null, ""),
  estimatedMinutes: Joi.number().integer().min(1).allow(null),
  dueDate: Joi.number().integer().min(0).allow(null),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().allow(null, ""),
  estimatedMinutes: Joi.number().integer().min(1).allow(null),
  dueDate: Joi.number().integer().min(0).allow(null),
  status: Joi.string().valid(...Object.values(TaskStatus)),
}).min(1);
