import { TaskActivity, ActivityType } from "../models/TaskActivity.js";
import { Task, TaskStatus } from "../models/Task.js";
import { Subject } from "../models/Subject.js";
import { DailyProgress } from "../models/DailyProgress.js";
import { DailyGoal } from "../models/DailyGoal.js";
import { Op } from "sequelize";

interface LogActivityDTO {
  subjectId: string;
  taskId?: string | null;
  activityType: ActivityType;
  minutesSpent: number;
  activityDate: number; // Start of day epoch
  activityTime: number;
}

class TaskActivityService {
  /* ─────────────────────────────
     LOG ACTIVITY
  ───────────────────────────── */
  static async logActivity(userId: string, data: LogActivityDTO) {
    const { subjectId, taskId, activityType, minutesSpent, activityDate, activityTime } = data;

    // 1. Create Activity Record
    const activity = await TaskActivity.create({
      userId,
      subjectId,
      taskId: taskId || null,
      activityType,
      minutesSpent,
      activityDate,
      activityTime,
    } as any);

    // 2. Update Task Status if applicable
    if (taskId && activityType === ActivityType.TASK_COMPLETED) {
      await Task.update(
        { status: TaskStatus.COMPLETED },
        { where: { id: taskId, userId } }
      );
    }

    // 3. Update Daily Progress (Aggregation)
    // Find or create progress for this day
    let progress = await DailyProgress.findOne({
      where: { userId, date: activityDate },
    });

    if (!progress) {
      progress = await DailyProgress.create({
        userId,
        date: activityDate,
        totalTasksCompleted: 0,
        totalMinutes: 0,
        goalAchieved: false,
        performanceScore: 0,
      } as any);
    }

    // Increment stats
    progress.totalMinutes += minutesSpent;
    if (activityType === ActivityType.TASK_COMPLETED) {
      progress.totalTasksCompleted += 1;
    }
    await progress.save();

    // 4. Check Goals
    // Get goals for this user/subject
    const goals = await DailyGoal.findAll({
      where: { userId, subjectId },
    });

    // Simple logic: if any goal is met, mark something? 
    // For now, we just updated the aggregate. 
    // A separate "GoalChecker" service might be better for complex logic, 
    // but basic "Goal Achieved" flag on DailyProgress can be updated here.

    // Calculate if *Daily* goal is met (across all subjects or this subject?)
    // The DailyProgress is usually "Global" for the day. 
    // If we want per-subject progress, we'd need a different model or query.
    // Assuming DailyProgress is global.

    return activity;
  }

  /* ─────────────────────────────
     GET ACTIVITIES
  ───────────────────────────── */
  static async getActivities(userId: string, query: any) {
    const { startDate, endDate, subjectId } = query;
    const where: any = { userId };

    if (subjectId) where.subjectId = subjectId;
    
    if (startDate && endDate) {
      where.activityDate = { 
        [Op.between]: [Number(startDate), Number(endDate)] 
      };
    }

    return TaskActivity.findAll({
      where,
      include: [
        { 
          model: Subject, 
          attributes: ["name", "color"] 
        },
        { 
          model: Task, 
          attributes: ["title"],
          required: false // LEFT JOIN in case task is null (manual log)
        },
      ],
      order: [["activityTime", "DESC"]],
    });
  }
}

export default TaskActivityService;
