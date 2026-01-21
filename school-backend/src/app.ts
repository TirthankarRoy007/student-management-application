import "dotenv/config";
import express, { type Application, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport, { configurePassport } from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import taskRoutes from "./routes/task.routes.js";
import taskActivityRoutes from "./routes/taskActivity.routes.js";
import userSubjectRoutes from "./routes/userSubject.routes.js";
import userRoutes from "./routes/user.routes.js";

configurePassport();

const app: Application = express();

/* ─────────────────────────────────────────────
   Core Middlewares
───────────────────────────────────────────── */

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(passport.initialize());

/* ─────────────────────────────────────────────
   Health Check
───────────────────────────────────────────── */

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/* ─────────────────────────────────────────────
   API Routes
───────────────────────────────────────────── */

app.get("/api/v1", (_req: Request, res: Response) => {
  res.json({ message: "Student Learning Tracker API v1" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/goals", goalRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/activities", taskActivityRoutes);
app.use("/api/v1", userSubjectRoutes);
app.use("/api/v1/users", userRoutes);

// Example: app.use("/api/v1/tasks", taskRoutes);

/* ─────────────────────────────────────────────
   404 Handler
───────────────────────────────────────────── */

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

/* ─────────────────────────────────────────────
   Global Error Handler
───────────────────────────────────────────── */

app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // Log error for debugging (only full stack in development)
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Error:", err);
    } else {
      console.error("❌ Error:", err.message);
    }

    // Handle known operational errors (AppError instances)
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    // Handle Sequelize validation errors
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
      const messages = err.errors?.map((e: any) => e.message) || [err.message];
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // Handle unexpected errors - don't leak internal details
    // FOR DEBUGGING: Leaking details to find the 500 cause
    res.status(500).json({
      success: false,
      message: "Internal server error",
      debug: process.env.NODE_ENV === "development" ? (err.message || err) : undefined,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
);

export default app;
