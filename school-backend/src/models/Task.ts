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
  HasMany,
} from "sequelize-typescript";
import { User } from "./User.js";
import { Subject } from "./Subject.js";
import { TaskActivity } from "./TaskActivity.js";

export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  SKIPPED = "skipped",
}

@Table({ tableName: "tasks", timestamps: false })
export class Task extends Model<Task> {
  @BeforeCreate
  static setCreatedAt(instance: Task) {
    const now = Date.now();
    instance.createdAt = now;
    instance.updatedAt = now;
  }

  @BeforeUpdate
  static setUpdatedAt(instance: Task) {
    instance.updatedAt = Date.now();
  }
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
  @Column({
    type: DataType.BIGINT,
    get() {
      const val = this.getDataValue('dueDate');
      return val === null ? null : Number(val);
    },
    set(val: number | null | undefined) {
      this.setDataValue('dueDate', (val === null || val === undefined) ? null : Number(val));
    },
  })
  declare dueDate: number | null;

  @AllowNull(false)
  @Default(TaskStatus.PENDING)
  @Column(DataType.ENUM(...Object.values(TaskStatus)))
  declare status: TaskStatus;

  @Column({
    type: DataType.BIGINT,
    get() {
      const val = this.getDataValue('createdAt');
      return val === null ? null : Number(val);
    },
    set(val: number | undefined) {
      this.setDataValue('createdAt', val === undefined ? Date.now() : Number(val));
    },
  })
  declare createdAt: number;

  @Column({
    type: DataType.BIGINT,
    get() {
      const val = this.getDataValue('updatedAt');
      return val === null ? null : Number(val);
    },
    set(val: number | undefined) {
      this.setDataValue('updatedAt', val === undefined ? Date.now() : Number(val));
    },
  })
  declare updatedAt: number;

  @BelongsTo(() => User)
  declare user?: User;

  @BelongsTo(() => Subject)
  declare subject?: Subject;

  @HasMany(() => TaskActivity)
  declare activities?: TaskActivity[];
}

export default Task;
