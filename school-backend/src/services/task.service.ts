import { Task } from "../models/Task.js";
import { Subject } from "../models/Subject.js";
import { UserSubject } from "../models/UserSubject.js";
import { TaskActivity, ActivityType } from "../models/TaskActivity.js";

interface CreateTaskDTO {
  subjectId: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  dueDate?: number;
}

class TaskService {
  /* ─────────────────────────────
     CREATE TASK
  ───────────────────────────── */
  static async createTask(userId: string, data: CreateTaskDTO) {
    const { subjectId, title, description, estimatedMinutes, dueDate } = data;

    // Check subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      throw { statusCode: 404, message: "Subject not found" };
    }

    // Check user enrolled
    const enrolled = await UserSubject.findOne({
      where: { userId, subjectId, isActive: true },
    });
    if (!enrolled) {
      throw { statusCode: 403, message: "User is not enrolled in this subject" };
    }

    const task = await Task.create({
      userId,
      subjectId,
      title,
      description,
      estimatedMinutes,
      dueDate,
    } as any);

    return task;
  }

  /* ─────────────────────────────
     GET MY TASKS
  ───────────────────────────── */
  static async getMyTasks(userId: string, query: any) {
    const { subjectId, status } = query;
    const whereClause: any = { userId };

    if (subjectId) whereClause.subjectId = subjectId;
    if (status) whereClause.status = status;

    return Task.findAll({
      where: whereClause,
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
     UPDATE TASK
  ───────────────────────────── */
static async updateTask(userId: string, taskId: string, updates: any) {
  console.log("➡️ Update Task called");
  console.log("UserId:", userId);
  console.log("TaskId:", taskId);
  console.log("Raw updates from client:", updates);

  const task = await Task.findOne({ where: { id: taskId, userId } });

  if (!task) {
    console.error("❌ Task not found");
    throw { statusCode: 404, message: "Task not found" };
  }

  console.log("🧾 Task fetched from DB");
  console.log("Current dueDate:", task.dueDate, "| type:", typeof task.dueDate);
  console.log("Current status:", task.status);

  // Explicitly pick allowed fields
  const safeUpdates: any = {};

  if (updates.title !== undefined) safeUpdates.title = updates.title;
  if (updates.description !== undefined) safeUpdates.description = updates.description;
  if (updates.estimatedMinutes !== undefined) safeUpdates.estimatedMinutes = updates.estimatedMinutes;

  if (updates.dueDate !== undefined) {
    console.log("📅 Incoming dueDate:", updates.dueDate, "| type:", typeof updates.dueDate);
    safeUpdates.dueDate = new Date(updates.dueDate).getTime();
    console.log("📅 Normalized dueDate:", safeUpdates.dueDate);
  }

  if (updates.status !== undefined) safeUpdates.status = updates.status;

  console.log("✅ Final safeUpdates object:", safeUpdates);

  // 🔥 Critical protection: update only intended fields
  try {
    await task.update(safeUpdates, { fields: Object.keys(safeUpdates) });
  } catch (error) {
    console.error("❌ Failed to update task in DB");
    console.error("Error:", error);
    console.error("dueDate before crash:", task.dueDate, typeof task.dueDate);
    throw error;
  }

  console.log("🎉 Task updated successfully:", task.id);
  return task;
}


  /* ─────────────────────────────
     DELETE TASK
  ───────────────────────────── */
  static async deleteTask(userId: string, taskId: string) {
    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) {
      throw { statusCode: 404, message: "Task not found" };
    }
    await task.destroy();
  }
}

export default TaskService;
