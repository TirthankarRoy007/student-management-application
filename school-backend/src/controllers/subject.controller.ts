import type { Request, Response, NextFunction } from "express";
import SubjectService from "../services/subject.service.js";

export default class SubjectController {
    // GET /api/v1/subjects
    static async getAllSubjects(_req: Request, res: Response, next: NextFunction) {
        try {
            const subjects = await SubjectService.getAllSubjects();
            res.json(subjects);
        } catch (err) {
            next(err);
        }
    }

    // POST /api/v1/subjects (admin)
    static async createSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const subject = await SubjectService.createSubject(req.body);
            res.status(201).json(subject);
        } catch (err) {
            next(err);
        }
    }

    // PUT /api/v1/subjects/:id (admin)
    static async updateSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                throw { statusCode: 400, message: "Subject id is required" };
            }

            const subject = await SubjectService.updateSubject(id, req.body);

            res.json(subject);
        } catch (err) {
            next(err);
        }
    }


    // DELETE /api/v1/subjects/:id (admin)
    static async deleteSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                throw { statusCode: 400, message: "Subject id is required" };
            }

            await SubjectService.deleteSubject(id);

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}
