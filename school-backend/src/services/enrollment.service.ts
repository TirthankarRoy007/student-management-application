import { UserSubject } from "../models/UserSubject.js";
import { Subject } from "../models/Subject.js";

class EnrollmentService {
  /* ─────────────────────────────
     ENROLL INTO SUBJECT
  ───────────────────────────── */

  static async enroll(userId: string, subjectId: string) {
    if (!subjectId) {
      throw { statusCode: 400, message: "subjectId is required" };
    }

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      throw { statusCode: 404, message: "Subject not found" };
    }

    const existing = await UserSubject.findOne({
      where: { userId, subjectId },
    });

    if (existing) {
      if (existing.isActive) {
        throw { statusCode: 409, message: "Already enrolled in this subject" };
      }

      // Re-activate if previously disabled
      await existing.update({ isActive: true });
      return existing;
    }

    const enrollment = await UserSubject.create({
      userId,
      subjectId,
      isActive: true,
    });

    return enrollment;
  }

  /* ─────────────────────────────
     GET MY ENROLLMENTS
  ───────────────────────────── */

  static async getMyEnrollments(userId: string) {
    return UserSubject.findAll({
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
     ACTIVATE / DEACTIVATE
  ───────────────────────────── */

  static async updateEnrollmentStatus(
    userId: string,
    enrollmentId: string,
    isActive: boolean
  ) {
    if (typeof isActive !== "boolean") {
      throw { statusCode: 400, message: "isActive must be boolean" };
    }

    const enrollment = await UserSubject.findOne({
      where: { id: enrollmentId, userId },
    });

    if (!enrollment) {
      throw { statusCode: 404, message: "Enrollment not found" };
    }

    await enrollment.update({ isActive });

    return enrollment;
  }
}

export default EnrollmentService;
