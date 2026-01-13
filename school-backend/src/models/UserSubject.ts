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
  BelongsTo,
} from "sequelize-typescript";
import type { Optional } from "sequelize";
import { User } from "./User.js";
import { Subject } from "./Subject.js";

/**
 * DB attributes
 */
export interface UserSubjectAttributes {
  id: string;
  userId: string;
  subjectId: string;
  isActive: boolean;
  createdAt: number;
}

/**
 * Attributes required at creation time
 */
export interface UserSubjectCreationAttributes
  extends Optional<UserSubjectAttributes, "id" | "isActive" | "createdAt"> {}

@Table({
  tableName: "user_subjects",
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ["userId", "subjectId"],
    },
  ],
})
export class UserSubject extends Model<
  UserSubjectAttributes,
  UserSubjectCreationAttributes
> {
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
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isActive: boolean;

  @CreatedAt
  @Column(DataType.BIGINT)
  declare createdAt: number;

  @BeforeCreate
  static beforeCreateHook(instance: UserSubject) {
    instance.createdAt = Date.now();
  }

  // Relations
  @BelongsTo(() => User)
  declare user?: User;

  @BelongsTo(() => Subject)
  declare subject?: Subject;
}

export default UserSubject;
