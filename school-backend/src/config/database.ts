import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

// Import all models explicitly for tsx/ESM compatibility
import { User } from "../models/User.js";
import { BurnoutSignal } from "../models/BurnoutSignal.js";
import { DailyGoal } from "../models/DailyGoal.js";
import { DailyProgress } from "../models/DailyProgress.js";
import { Notification } from "../models/Notification.js";
import { Streak } from "../models/Streak.js";
import { StreakHistory } from "../models/StreakHistory.js";
import { Subject } from "../models/Subject.js";
import { Task } from "../models/Task.js";
import { TaskActivity } from "../models/TaskActivity.js";
import { UserSubject } from "../models/UserSubject.js";
import { WeeklyReport } from "../models/WeeklyReport.js";

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SSL,
  DB_LOGGING,
} = process.env;

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: DB_HOST!,
  port: Number(DB_PORT || 5432),
  database: DB_NAME!,
  username: DB_USER!,
  password: DB_PASSWORD!,

  models: [
    User,
    BurnoutSignal,
    DailyGoal,
    DailyProgress,
    Notification,
    Streak,
    StreakHistory,
    Subject,
    Task,
    TaskActivity,
    UserSubject,
    WeeklyReport,
  ],

  logging: DB_LOGGING === "true" ? console.log : false,

  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },

  dialectOptions:
    DB_SSL === "true"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},

  timezone: "+00:00", // store everything in UTC (you already use epoch)
});
