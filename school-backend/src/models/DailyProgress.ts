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

@Table({
  tableName: "daily_progress",
  timestamps: false,
})
export class DailyProgress extends Model<DailyProgress> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  // Start of day epoch (00:00 UTC adjusted to user's timezone in service)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare date: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare totalTasksCompleted: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare totalMinutes: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare goalAchieved: boolean;

  // 0 – 100 (calculated by analytics engine)
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare performanceScore: number;

  @Column(DataType.BIGINT)
  declare createdAt: number;

  @BeforeCreate
  static setCreatedAt(instance: DailyProgress) {
    instance.createdAt = Date.now();
  }
}

export default DailyProgress;
