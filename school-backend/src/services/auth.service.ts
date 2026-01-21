import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import { User, UserRole } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import EmailService from "./email.service.js";

const JWT_EXPIRES_IN = "30d";

class AuthService {
  static async register(name: string, email: string, password: string) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw AppError.conflict("Email already registered");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: UserRole.STUDENT,
    });

    return { success: true };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw AppError.unauthorized("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw AppError.unauthorized("Invalid credentials");

    return this.generateToken(user);
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw AppError.notFound("User not found with that email");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = passwordResetExpires;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      await EmailService.sendResetPasswordEmail(
        user.email,
        user.name,
        resetUrl
      );
    } catch (err) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      throw AppError.internal(
        "There was an error sending the email. Try again later!"
      );
    }

    return { message: "Token sent to email!" };
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      throw AppError.badRequest("Token is invalid or has expired");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return { success: true };
  }

  private static generateToken(user: User) {
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export default AuthService;
