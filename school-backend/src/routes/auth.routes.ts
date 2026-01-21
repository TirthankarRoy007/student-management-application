import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/forgotPassword", AuthController.forgotPassword);
router.post("/resetPassword/:token", AuthController.resetPassword);
router.get("/me", authenticateJwt, AuthController.me);

export default router;
