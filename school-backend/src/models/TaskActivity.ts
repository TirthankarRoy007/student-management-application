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
  BeforeCreate,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User.js";
import { Subject } from "./Subject.js";
import { Task } from "./Task.js";

export enum ActivityType {
  TASK_COMPLETED = "task_completed",
  MANUAL_LOG = "manual_log",
  REVISION = "revision",
  TEST = "test",
}

@Table({ tableName: "task_activity", timestamps: false })
export class TaskActivity extends Model<TaskActivity> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => Subject)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare subjectId: string;

  @BelongsTo(() => Subject)
  declare subject?: Subject;

  @ForeignKey(() => Task)
  @AllowNull(true)
  @Column(DataType.UUID)
  declare taskId: string | null;

  @BelongsTo(() => Task)
  declare task?: Task;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ActivityType)))
  declare activityType: ActivityType;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare minutesSpent: number;

  // exact event time (epoch ms)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare activityTime: number;

  // start of day epoch (for fast grouping)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare activityDate: number;

  @Column(DataType.BIGINT)
  declare createdAt: number;
}

export default TaskActivity;
