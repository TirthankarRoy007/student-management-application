import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { authenticateJwt, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateJwt);

// Only admins can view the student list
router.get("/students", authorizeRoles("admin"), UserController.getAllStudents);

// Update user (self or admin)
router.put("/:id", UserController.updateUser);

export default router;
