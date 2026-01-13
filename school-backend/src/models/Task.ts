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
} from "sequelize-typescript";
import { User } from "./User.js";
import { Subject } from "./Subject.js";

export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  SKIPPED = "skipped",
}

@Table({ tableName: "tasks", timestamps: true })
export class Task extends Model<Task> {
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
  @Column(DataType.STRING)
  declare title: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare estimatedMinutes: number | null;

  @AllowNull(true)
  @Column(DataType.BIGINT)
  declare dueDate: number | null;

  @AllowNull(false)
  @Default(TaskStatus.PENDING)
  @Column(DataType.ENUM(...Object.values(TaskStatus)))
  declare status: TaskStatus;

  @CreatedAt
  @Column(DataType.BIGINT)
  declare createdAt: number;

  @UpdatedAt
  @Column(DataType.BIGINT)
  declare updatedAt: number;

  @BeforeCreate
  static beforeCreateHook(instance: Task) {
    const now = Date.now();
    instance.createdAt = now;
    instance.updatedAt = now;
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: Task) {
    instance.updatedAt = Date.now();
  }
}

export default Task;
