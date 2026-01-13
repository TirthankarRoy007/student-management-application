import { UserSubject } from "../models/UserSubject.js";
import { Subject } from "../models/Subject.js";
import { DailyGoal } from "../models/DailyGoal.js";

export class UserSubjectService {
  // ✅ Enroll a subject to a student
  static async enrollSubject(userId: string, subjectId: string) {
    // Check existing mapping
    const existing = await UserSubject.findOne({
      where: { userId, subjectId },
    });

    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return existing;
      }

      throw { statusCode: 409, message: "Subject already enrolled" };
    }

    return UserSubject.create({ userId, subjectId });
  }

  // ✅ Unenroll (soft remove)
  static async unenrollSubject(userId: string, subjectId: string) {
    const mapping = await UserSubject.findOne({
      where: { userId, subjectId, isActive: true },
    });

    if (!mapping) {
      throw { statusCode: 404, message: "Enrollment not found" };
    }

    mapping.isActive = false;
    await mapping.save();

    return true;
  }

  // ✅ Get all subjects of a student
  static async getUserSubjects(userId: string) {
    return UserSubject.findAll({
      where: { userId, isActive: true },
      include: [{ model: Subject }],
      order: [["createdAt", "DESC"]],
    });
  }

  // ✅ Get one subject enrollment with goals
  static async getUserSubjectWithGoals(userId: string, subjectId: string) {
    const enrollment = await UserSubject.findOne({
      where: { userId, subjectId, isActive: true },
      include: [
        { model: Subject },
        {
          model: DailyGoal,
          where: { userId },
          required: false,
        },
      ],
    });

    if (!enrollment) {
      throw { statusCode: 404, message: "Subject not enrolled" };
    }

    return enrollment;
  }
}
