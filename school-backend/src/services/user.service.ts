import { User, UserRole } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

class UserService {
  static async getAllStudents() {
    return User.findAll({
      where: { role: UserRole.STUDENT },
      attributes: { exclude: ["password", "resetPasswordToken", "resetPasswordExpires"] },
      order: [["name", "ASC"]],
    });
  }

  static async updateUser(userId: string, data: { name?: string; email?: string }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw AppError.notFound("User not found");
    }

    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ where: { email: data.email } });
      if (existing) {
        throw AppError.conflict("Email already in use");
      }
    }

    await user.update(data);
    
    // Return user without sensitive data
    const userJSON = user.toJSON() as any;
    delete userJSON.password;
    delete userJSON.resetPasswordToken;
    delete userJSON.resetPasswordExpires;
    
    return userJSON;
  }
}

export default UserService;
