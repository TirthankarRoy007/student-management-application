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
} from "sequelize-typescript";
import { User } from "./User.js";

export enum BurnoutSignalType {
  LOW_CONSISTENCY = "low_consistency",
  DECLINING_TIME = "declining_time",
  STREAK_BREAKS = "streak_breaks",
  OVERLOAD = "overload",
}

export enum BurnoutRiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

@Table({
  tableName: "burnout_signals",
  timestamps: true,
  updatedAt: false,
})
export class BurnoutSignal extends Model<BurnoutSignal> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(BurnoutSignalType)))
  declare signalType: BurnoutSignalType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(BurnoutRiskLevel)))
  declare riskLevel: BurnoutRiskLevel;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare message: string;

  // Week this signal belongs to (start of week epoch ms)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare generatedForWeek: number;

  @CreatedAt
  @Column(DataType.BIGINT)
  declare createdAt: number;
}

export default BurnoutSignal;
