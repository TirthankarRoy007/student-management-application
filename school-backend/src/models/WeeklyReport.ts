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
} from "sequelize-typescript";
import { User } from "./User.js";
import { Subject } from "./Subject.js";

@Table({ tableName: "weekly_reports", timestamps: true, updatedAt: false })
export class WeeklyReport extends Model<WeeklyReport> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare weekStartDate: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare weekEndDate: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare totalTasks: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare totalMinutes: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare averageScore: number;

  @ForeignKey(() => Subject)
  @AllowNull(true)
  @Column(DataType.UUID)
  declare bestSubjectId: string | null;

  @ForeignKey(() => Subject)
  @AllowNull(true)
  @Column(DataType.UUID)
  declare worstSubjectId: string | null;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare consistencyPercent: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare systemSummary: string;

  @CreatedAt
  @Column(DataType.BIGINT)
  declare createdAt: number;

  @BeforeCreate
  static beforeCreateHook(instance: WeeklyReport) {
    instance.createdAt = Date.now();
  }
}

export default WeeklyReport;
