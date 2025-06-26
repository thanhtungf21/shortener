// config/config.js
import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsDomain: process.env.CORS_DOMAIN || "http://localhost:3000",
  isVercel: process.env.VERCEL === "1",
};

export default config;
