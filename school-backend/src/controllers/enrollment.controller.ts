import type { Response, NextFunction } from "express";
import EnrollmentService from "../services/enrollment.service.js";

export default class EnrollmentController {
  // POST /api/v1/enrollments
  static async enroll(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { subjectId } = req.body;

      const enrollment = await EnrollmentService.enroll(userId, subjectId);
      res.status(201).json(enrollment);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/v1/enrollments
  static async getMyEnrollments(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const enrollments = await EnrollmentService.getMyEnrollments(userId);
      res.json(enrollments);
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/v1/enrollments/:id
  static async updateEnrollmentStatus(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const enrollmentId = req.params.id;
      const { isActive } = req.body;

      const updated = await EnrollmentService.updateEnrollmentStatus(
        userId,
        enrollmentId,
        isActive
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
}
