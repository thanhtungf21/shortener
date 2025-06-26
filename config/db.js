// config/db.js
import mongoose from "mongoose";
import config from "./config.js"; // Import config

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri); // Sử dụng URI từ config
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
