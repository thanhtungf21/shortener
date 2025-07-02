// config/db.js
import mongoose from "mongoose";
import config from "./config.js";
import logger from "../utils/logger.util.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    // Thay thế console.log
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Thay thế console.error
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
