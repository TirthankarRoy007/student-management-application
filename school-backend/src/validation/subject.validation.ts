import Joi from "joi";

export const createSubjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  color: Joi.string().trim().optional(),
  icon: Joi.string().trim().optional(),
});

export const updateSubjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  color: Joi.string().trim().allow(null),
  icon: Joi.string().trim().allow(null),
}).min(1); // at least one field required
