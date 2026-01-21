import type { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service.js";

export default class UserController {
  static async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await UserService.getAllStudents();
      res.json(students);
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as any;
      const userId = req.params.id === "me" ? user.id : req.params.id;
      const result = await UserService.updateUser(userId, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
