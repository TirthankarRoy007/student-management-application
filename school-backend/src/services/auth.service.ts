import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

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

    return this.generateToken(user);
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw AppError.unauthorized("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw AppError.unauthorized("Invalid credentials");

    return this.generateToken(user);
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
