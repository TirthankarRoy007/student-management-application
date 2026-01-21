import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import type { Optional } from "sequelize";
import { User } from "./User.js";
import { UserSubject } from "./UserSubject.js";
import { DailyGoal } from "./DailyGoal.js";
import { Task } from "./Task.js";
import { TaskActivity } from "./TaskActivity.js";

/**
 * DB attributes
 */
export interface SubjectAttributes {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  createdAt: number;
  updatedAt: number;
}

/**
 * Attributes required when creating a Subject
 */
export interface SubjectCreationAttributes
  extends Optional<
    SubjectAttributes,
    "id" | "color" | "icon" | "createdAt" | "updatedAt"
  > {}

@Table({
  tableName: "subjects",
  timestamps: true,
})
export class Subject extends Model<
  SubjectAttributes,
  SubjectCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  // For UI (charts, cards, etc.)
  @AllowNull(true)
  @Column(DataType.STRING)
  declare color: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare icon: string | null;

  @CreatedAt
  @Column(DataType.BIGINT)
  declare createdAt: number;

  @UpdatedAt
  @Column(DataType.BIGINT)
  declare updatedAt: number;

  @BeforeCreate
  static setCreatedAt(instance: Subject) {
    const now = Date.now();
    instance.createdAt = now;
    instance.updatedAt = now;
  }

  @BeforeUpdate
  static setUpdatedAt(instance: Subject) {
    instance.updatedAt = Date.now();
  }

  // Relations
  @BelongsToMany(() => User, () => UserSubject)
  declare users?: User[];

  @HasMany(() => UserSubject)
  declare userSubjects?: UserSubject[];

  @HasMany(() => DailyGoal)
  declare dailyGoals?: DailyGoal[];

  @HasMany(() => Task)
  declare tasks?: Task[];

  @HasMany(() => TaskActivity)
  declare taskActivities?: TaskActivity[];
}

export default Subject;