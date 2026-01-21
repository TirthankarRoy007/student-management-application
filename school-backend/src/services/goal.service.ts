import { DailyGoal, GoalTargetType } from "../models/DailyGoal.js";
import { UserSubject } from "../models/UserSubject.js";
import { Subject } from "../models/Subject.js";
import { TaskActivity, ActivityType } from "../models/TaskActivity.js";
import { Op } from "sequelize";

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
    // 1. Define "Today"
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayStartEpoch = todayStart.getTime();

    // 2. Fetch User's Manual Goals
    const dbGoals = await DailyGoal.findAll({
      where: { userId },
      include: [
        {
          model: Subject,
          attributes: ["id", "name", "color", "icon"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 3. Fetch Tasks Created Today (or Updated Today if we want to catch completions of old tasks? 
    // User said "If I create task 1...", implying creation is the trigger.
    // But usually a Daily Goal includes any active task for the day.
    // For now, let's stick to "Created Today" as per the prompt's strong implication,
    // AND also include tasks that were COMPLETED today even if created earlier?
    // Let's stick to "Created Today" to be safe with the "according to the tasks" phrasing.
    // Actually, "My Daily Goals" usually means "Todo list for today".
    // Let's fetch ALL PENDING tasks OR Tasks COMPLETED Today OR Created Today.
    // To simplify and match the specific request: "If I create task 1...".
    // We will fetch tasks created >= todayStart.
    const tasksToday = await import("../models/Task.js").then(({ Task }) => 
      Task.findAll({
        where: {
          userId,
          createdAt: { [Op.gte]: todayStartEpoch }
        },
        include: [{ model: Subject, attributes: ["id", "name", "color", "icon"] }]
      })
    );

    // 4. Fetch Activities (for Minutes-based goals)
    const activitiesToday = await TaskActivity.findAll({
      where: {
        userId,
        activityTime: { [Op.gte]: todayStartEpoch }
      }
    });

    // 5. Merge Logic
    // We want a list of Goals.
    // Map by SubjectId.
    const goalMap = new Map<string, any>();

    // A. Populate from DB Goals first
    for (const dbGoal of dbGoals) {
      goalMap.set(dbGoal.subjectId, {
        id: dbGoal.id,
        subjectId: dbGoal.subjectId,
        targetType: dbGoal.targetType,
        targetValue: dbGoal.targetValue, // Default, might be overridden
        subject: dbGoal.subject,
        isVirtual: false
      });
    }

    // B. Populate/Update from Tasks
    // Group tasks by subject
    const tasksBySubject = new Map<string, any[]>();
    for (const task of tasksToday) {
      if (!tasksBySubject.has(task.subjectId)) {
        tasksBySubject.set(task.subjectId, []);
      }
      tasksBySubject.get(task.subjectId)?.push(task);
    }

    // Iterate all subjects that have tasks
    for (const [subjectId, tasks] of tasksBySubject) {
      const existingGoal = goalMap.get(subjectId);
      const totalTasks = tasks.length;
      
      // If we rely on the `Task.status` for completion:
      const completedTasks = tasks.filter(t => t.status === "completed").length;

      if (existingGoal) {
        // If explicit goal exists
        if (existingGoal.targetType === GoalTargetType.TASK_COUNT) {
          // OVERRIDE target with actual task count
          existingGoal.targetValue = totalTasks;
          existingGoal.currentAmount = completedTasks;
          existingGoal.progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        } 
        // If MINUTES, we calculate differently later (block C)
      } else {
        // NO explicit goal -> Create Virtual Goal
        // We need subject details. The tasks have them included.
        const subjectData = tasks[0].subject;
        
        goalMap.set(subjectId, {
          id: `virtual-${subjectId}`, // Fake ID
          subjectId: subjectId,
          targetType: GoalTargetType.TASK_COUNT,
          targetValue: totalTasks,
          currentAmount: completedTasks,
          progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          subject: subjectData,
          isVirtual: true
        });
      }
    }

    // C. Calculate Progress for MINUTES based goals (DB only)
    for (const goal of goalMap.values()) {
      if (goal.targetType === GoalTargetType.MINUTES) {
        const subjectActivities = activitiesToday.filter(a => a.subjectId === goal.subjectId);
        const minutesSpent = subjectActivities.reduce((sum, a) => sum + a.minutesSpent, 0);
        
        goal.currentAmount = minutesSpent;
        goal.progressPercentage = Math.min(Math.round((minutesSpent / goal.targetValue) * 100), 100);
      }
      // TASK_COUNT goals (both virtual and db) were handled in block B, 
      // EXCEPT for DB goals that have NO tasks created today.
      else if (goal.targetType === GoalTargetType.TASK_COUNT && goal.currentAmount === undefined) {
         // No tasks created today for this existing goal?
         // User said "according to the tasks goals should be created".
         // If no tasks, maybe target is 0? Or keep DB target?
         // Let's assume if no tasks are created, progress is 0/0 -> 0%.
         // Or should we keep the manual target?
         // If I set a goal "Do 5 tasks" but create 0, I have 0 progress.
         // Let's default to DB target if no tasks found, but progress is 0.
         // But wait, the user wants dynamic.
         // Let's set targetValue to 0 if no tasks found? 
         // "only one tab ... those two tasks should be counted".
         // If 0 tasks, it shows 0/X or 0/0?
         // Let's stick to the DB target if no tasks exist, so the user remembers their goal.
         goal.currentAmount = 0;
         goal.progressPercentage = 0;
      }
    }

    return Array.from(goalMap.values());
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
