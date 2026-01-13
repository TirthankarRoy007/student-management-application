import type { Response, NextFunction } from "express";
import GoalService from "../services/goal.service.js";

export default class GoalController {
  // POST /api/v1/goals
  static async createGoal(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { subjectId, targetType, targetValue } = req.body;

      const goal = await GoalService.createGoal(userId, {
        subjectId,
        targetType,
        targetValue,
      });

      res.status(201).json(goal);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/v1/goals
  static async getMyGoals(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const goals = await GoalService.getMyGoals(userId);
      res.json(goals);
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/v1/goals/:id
  static async updateGoal(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const goalId = req.params.id;
      const updates = req.body;

      const updated = await GoalService.updateGoal(
        userId,
        goalId,
        updates
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/v1/goals/:id
  static async deleteGoal(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const goalId = req.params.id;

      await GoalService.deleteGoal(userId, goalId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
