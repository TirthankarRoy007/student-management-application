import { DailyGoal, GoalTargetType } from "../models/DailyGoal.js";
import { UserSubject } from "../models/UserSubject.js";
import { Subject } from "../models/Subject.js";

interface CreateGoalDTO {
  subjectId: string;
  targetType: GoalTargetType;
  targetValue: number;
}

class GoalService {
  /* ─────────────────────────────
     CREATE GOAL
  ───────────────────────────── */

  static async createGoal(userId: string, data: CreateGoalDTO) {
    const { subjectId, targetType, targetValue } = data;

    if (!subjectId || !targetType || !targetValue) {
      throw { statusCode: 400, message: "Missing required fields" };
    }

    if (targetValue <= 0) {
      throw { statusCode: 400, message: "Target value must be greater than 0" };
    }

    // Check subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      throw { statusCode: 404, message: "Subject not found" };
    }

    // Check user enrolled in subject
    const enrolled = await UserSubject.findOne({
      where: { userId, subjectId, isActive: true },
    });

    if (!enrolled) {
      throw {
        statusCode: 403,
        message: "User is not enrolled in this subject",
      };
    }

    // Ensure only one goal per subject
    const existingGoal = await DailyGoal.findOne({
      where: { userId, subjectId },
    });

    if (existingGoal) {
      throw {
        statusCode: 409,
        message: "Daily goal already exists for this subject",
      };
    }

    const goal = await DailyGoal.create({
      userId,
      subjectId,
      targetType,
      targetValue,
    });

    return goal;
  }

  /* ─────────────────────────────
     GET MY GOALS
  ───────────────────────────── */

  static async getMyGoals(userId: string) {
    return DailyGoal.findAll({
      where: { userId },
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "color", "icon"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  /* ─────────────────────────────
     UPDATE GOAL
  ───────────────────────────── */

  static async updateGoal(userId: string, goalId: string, updates: any) {
    const goal = await DailyGoal.findOne({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw { statusCode: 404, message: "Daily goal not found" };
    }

    if (updates.targetValue !== undefined && updates.targetValue <= 0) {
      throw {
        statusCode: 400,
        message: "Target value must be greater than 0",
      };
    }

    await goal.update({
      targetType: updates.targetType ?? goal.targetType,
      targetValue: updates.targetValue ?? goal.targetValue,
    });

    return goal;
  }

  /* ─────────────────────────────
     DELETE GOAL
  ───────────────────────────── */

  static async deleteGoal(userId: string, goalId: string) {
    const goal = await DailyGoal.findOne({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw { statusCode: 404, message: "Daily goal not found" };
    }

    await goal.destroy();
  }
}

export default GoalService;
