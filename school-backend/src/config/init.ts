import { sequelize } from "./database.js";

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // use only in local/dev
    await sequelize.sync({ alter: true });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}
