// index.js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/config.js";
import logger from "./utils/logger.util.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(config.mongoUri);

    if (!config.isVercel) {
      app.listen(config.port, () => {
        // Thay thế console.log
        logger.info(`Server is running on http://localhost:${config.port}`);
        logger.info(`Environment: ${config.env}`);
      });
    }
  } catch (error) {
    // Thay thế console.error
    logger.error("Failed to start the server.", error);
    process.exit(1);
  }
};

startServer();

export default app;
