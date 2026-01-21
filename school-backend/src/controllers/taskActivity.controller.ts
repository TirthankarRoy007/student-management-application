import type { Response, NextFunction } from "express";
import TaskActivityService from "../services/taskActivity.service.js";

export default class TaskActivityController {
  // POST /api/v1/activities
  static async logActivity(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const activity = await TaskActivityService.logActivity(userId, req.body);
      res.status(201).json(activity);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/v1/activities
  static async getActivities(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const activities = await TaskActivityService.getActivities(userId, req.query);
      res.json(activities);
    } catch (err) {
      next(err);
    }
  }
}
