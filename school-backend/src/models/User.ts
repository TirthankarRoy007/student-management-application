import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import DailyGoal from "./DailyGoal.js";
import Subject from "./Subject.js";
import UserSubject from "./UserSubject.js";

export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
}

interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  timezone?: string;
}

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(false)
  @Default(UserRole.STUDENT)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  declare role: UserRole;

  @AllowNull(false)
  @Default("UTC")
  @Column(DataType.STRING)
  declare timezone: string;

  @CreatedAt
  @Column(DataType.BIGINT)
  declare createdAt: number;

  @UpdatedAt
  @Column(DataType.BIGINT)
  declare updatedAt: number;

  @BelongsToMany(() => Subject, () => UserSubject)
  declare subjects?: Subject[];

  @HasMany(() => UserSubject)
  declare userSubjects?: UserSubject[];

  @HasMany(() => DailyGoal)
  declare dailyGoals?: DailyGoal[];

  @BeforeCreate
  static setCreatedAt(instance: User) {
    const now = Date.now();
    instance.createdAt = now;
    instance.updatedAt = now;
  }

  @BeforeUpdate
  static setUpdatedAt(instance: User) {
    instance.updatedAt = Date.now();
  }
}

export default User;
