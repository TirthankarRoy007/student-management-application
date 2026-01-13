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

export enum NotificationType {
  STREAK_BROKEN = "streak_broken",
  STREAK_MILESTONE = "streak_milestone",
  BURNOUT_WARNING = "burnout_warning",
  WEEKLY_REPORT = "weekly_report",
  SYSTEM = "system",
}

@Table({
  tableName: "notifications",
  timestamps: true,
  updatedAt: false,
})
export class Notification extends Model<Notification> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(NotificationType)))
  declare type: NotificationType;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare message: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isRead: boolean;

  @CreatedAt
  @Column(DataType.BIGINT)
  declare createdAt: number;

  @BeforeCreate
  static setCreatedAt(instance: Notification) {
    instance.createdAt = Date.now();
  }
}

export default Notification;
