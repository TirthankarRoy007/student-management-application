import type { Request, Response, NextFunction } from "express";
import type { Schema } from "joi";

export const validate =
  (schema: Schema, property: "body" | "params" | "query" = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next({ statusCode: 400, message });
    }

    req[property] = value;
    next();
  };
