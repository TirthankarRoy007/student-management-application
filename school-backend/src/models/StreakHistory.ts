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

export enum StreakBrokenReason {
  MISSED_GOAL = "missed_goal",
  MANUAL_RESET = "manual_reset",
  SYSTEM_RESET = "system_reset",
}

@Table({
  tableName: "streak_history",
  timestamps: true,
  updatedAt: false,
})
export class StreakHistory extends Model<StreakHistory> {
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
  declare startDate: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare endDate: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare length: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(StreakBrokenReason)))
  declare brokenReason: StreakBrokenReason;

  @CreatedAt
  @Column(DataType.BIGINT)
  declare createdAt: number;

  @BeforeCreate
  static setCreatedAt(instance: StreakHistory) {
    instance.createdAt = Date.now();
  }
}

export default StreakHistory;
