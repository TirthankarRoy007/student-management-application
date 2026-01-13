import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import { User } from "./User.js";

export enum StreakStatus {
  ACTIVE = "active",
  BROKEN = "broken",
}

@Table({
  tableName: "streaks",
  timestamps: true,
  createdAt: false,
})
export class Streak extends Model<Streak> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare currentStreak: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare longestStreak: number;

  // last successful day (start of day epoch ms)
  @AllowNull(true)
  @Column(DataType.BIGINT)
  declare lastActiveDate: number | null;

  @AllowNull(false)
  @Default(StreakStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(StreakStatus)))
  declare status: StreakStatus;

  @UpdatedAt
  @Column(DataType.BIGINT)
  declare updatedAt: number;

  @BeforeCreate
  static setCreatedAt(instance: Streak) {
    instance.updatedAt = Date.now();
  }

  @BeforeUpdate
  static setUpdatedAt(instance: Streak) {
    instance.updatedAt = Date.now();
  }
}

export default Streak;
