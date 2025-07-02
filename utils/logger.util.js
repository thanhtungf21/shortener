// utils/logger.js
import winston from "winston";
import config from "../config/config.js";

const { combine, timestamp, printf, colorize, align } = winston.format;

// Định dạng log cho console
const consoleFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

// Định dạng log cho file (sẽ chỉ dùng khi không ở trên Vercel)
const fileFormat = combine(
  timestamp(),
  printf((info) =>
    JSON.stringify({
      timestamp: info.timestamp,
      level: info.level,
      message: info.message,
    })
  )
);

const transports = [
  // Luôn ghi log ra console, Vercel sẽ tự động thu thập log này
  new winston.transports.Console({
    level: config.env === "development" ? "debug" : "info",
    format: consoleFormat,
  }),
];

// *** THAY ĐỔI QUAN TRỌNG Ở ĐÂY ***
// Chỉ ghi log ra file khi ở môi trường production VÀ KHÔNG phải trên Vercel
if (config.env === "production" && !config.isVercel) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  transports.push(
    new winston.transports.File({
      filename: "logs/combined.log",
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  transports,
});

export default logger;
