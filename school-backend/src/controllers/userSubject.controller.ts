import type { Request, Response, NextFunction } from "express";
import { UserSubjectService } from "../services/userSubject.service.js";

export class UserSubjectController {
  // POST /api/v1/students/:id/subjects
  static async enroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { subjectId } = req.body;

      if (!id) throw { statusCode: 400, message: "Student id is required" };
      if (!subjectId) throw { statusCode: 400, message: "subjectId is required" };

      const result = await UserSubjectService.enrollSubject(id, subjectId);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/v1/students/:id/subjects/:subjectId
  static async unenroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, subjectId } = req.params;

      if (!id) throw { statusCode: 400, message: "Student id is required" };
      if (!subjectId)
        throw { statusCode: 400, message: "subjectId is required" };

      await UserSubjectService.unenrollSubject(id, subjectId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/v1/students/:id/subjects
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) throw { statusCode: 400, message: "Student id is required" };

      const subjects = await UserSubjectService.getUserSubjects(id);
      res.json(subjects);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/v1/students/:id/subjects/:subjectId/dashboard
  static async subjectDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, subjectId } = req.params;

      if (!id) throw { statusCode: 400, message: "Student id is required" };
      if (!subjectId)
        throw { statusCode: 400, message: "subjectId is required" };

      const data = await UserSubjectService.getUserSubjectWithGoals(
        id,
        subjectId
      );

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}
