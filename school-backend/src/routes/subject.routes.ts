import { Router } from "express";
import SubjectController from "../controllers/subject.controller.js";
import { authenticateJwt, authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../validation/subject.validation.js";

const router = Router();

// All subject routes require authentication
router.use(authenticateJwt);

router.get("/", SubjectController.getAllSubjects);
router.post(
  "/",
  authorizeRoles("admin"),
  validate(createSubjectSchema),
  SubjectController.createSubject
)
router.put(
  "/:id",
  authorizeRoles("admin"),
  validate(updateSubjectSchema),
  SubjectController.updateSubject
);
router.delete(
  "/:id",
  authorizeRoles("admin"),
  SubjectController.deleteSubject
);

export default router;
