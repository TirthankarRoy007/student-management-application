import passport from "passport";
import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";

export const authenticateJwt: RequestHandler =
  passport.authenticate("jwt", { session: false });

export const authorizeRoles = (...roles: string[]): RequestHandler => {
  return (req: any, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden("Access denied"));
    }
    next();
  };
};
