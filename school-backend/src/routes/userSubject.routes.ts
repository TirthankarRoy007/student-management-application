import { Router } from "express";
import { UserSubjectController } from "../controllers/userSubject.controller.js";

const router = Router();

// enroll subject
router.post("/students/:id/subjects", UserSubjectController.enroll);

// remove subject
router.delete(
  "/students/:id/subjects/:subjectId",
  UserSubjectController.unenroll
);

// list enrolled subjects
router.get("/students/:id/subjects", UserSubjectController.list);

// subject dashboard (with goals)
router.get(
  "/students/:id/subjects/:subjectId/dashboard",
  UserSubjectController.subjectDashboard
);

export default router;
