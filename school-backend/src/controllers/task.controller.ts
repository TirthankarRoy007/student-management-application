import type { Response, NextFunction } from "express";
import TaskService from "../services/task.service.js";

export default class TaskController {
  // POST /api/v1/tasks
  static async createTask(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const task = await TaskService.createTask(userId, req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/v1/tasks
  static async getMyTasks(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const tasks = await TaskService.getMyTasks(userId, req.query);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/v1/tasks/:id
  static async updateTask(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const task = await TaskService.updateTask(userId, taskId, req.body);
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/v1/tasks/:id
  static async deleteTask(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      await TaskService.deleteTask(userId, taskId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
