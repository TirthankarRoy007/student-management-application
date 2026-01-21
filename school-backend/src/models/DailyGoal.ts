import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User.js";
import { Subject } from "./Subject.js";

export enum GoalTargetType {
  TASK_COUNT = "task_count",
  MINUTES = "minutes",
  MIXED = "mixed",
}

/* ─────────────────────────────────────────────
   Type Helpers
───────────────────────────────────────────── */

interface DailyGoalAttributes {
  id: string;
  userId: string;
  subjectId: string;
  targetType: GoalTargetType;
  targetValue: number;
  createdAt: number;
  updatedAt: number;
}

type DailyGoalCreationAttributes = Omit<
  DailyGoalAttributes,
  "id" | "createdAt" | "updatedAt"
>;

/* ─────────────────────────────────────────────
   Model
───────────────────────────────────────────── */

@Table({
  tableName: "daily_goals",
  timestamps: false,
})
export class DailyGoal extends Model<
  DailyGoalAttributes,
  DailyGoalCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @ForeignKey(() => Subject)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare subjectId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(GoalTargetType)))
  declare targetType: GoalTargetType;

  // Example:
  // TASK_COUNT → 2
  // MINUTES → 30
  // MIXED → backend decides rule
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare targetValue: number;

  @Column(DataType.BIGINT)
  declare createdAt: number;

  @Column(DataType.BIGINT)
  declare updatedAt: number;

  @BeforeCreate
  static setCreatedAt(instance: DailyGoal) {
    const now = Date.now();
    instance.createdAt = now;
    instance.updatedAt = now;
  }

  @BeforeUpdate
  static setUpdatedAt(instance: DailyGoal) {
    instance.updatedAt = Date.now();
  }

  // Relations
  @BelongsTo(() => User)
  declare user?: User;

  @BelongsTo(() => Subject)
  declare subject?: Subject;
}

export default DailyGoal;
