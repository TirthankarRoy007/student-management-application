import app from "./app.js";
import { initDatabase } from "./config/init.js";

const PORT = process.env.PORT || 3000;

(async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
