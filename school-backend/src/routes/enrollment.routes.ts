import { Router } from "express";
import EnrollmentController from "../controllers/enrollment.controller.js";
import { authenticateJwt } from "../middleware/auth.middleware.js";

const router = Router();

// All enrollment routes require authentication
router.use(authenticateJwt);

// Enroll into a subject
router.post("/", EnrollmentController.enroll);

// Get my enrolled subjects
router.get("/", EnrollmentController.getMyEnrollments);

// Activate / deactivate enrollment
router.patch("/:id", EnrollmentController.updateEnrollmentStatus);

export default router;
