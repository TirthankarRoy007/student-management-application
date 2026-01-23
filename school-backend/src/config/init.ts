import { sequelize } from "./database.js";
import { User, UserRole } from "../models/User.js";
import bcrypt from "bcryptjs";

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // use only in local/dev
    await sequelize.sync({ alter: true });

    // Seed default admin
    const adminEmail = "rtirtha97@gmail.com";
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      console.log("Creating default admin user...");
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      console.log("✅ Default admin user created");
    } else {
      console.log("Default admin user already exists");
    }

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}
