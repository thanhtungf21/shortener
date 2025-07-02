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

// Định dạng log cho file (thường là JSON để dễ phân tích)
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
  // Luôn ghi log ra console
  new winston.transports.Console({
    level: config.env === "development" ? "debug" : "info", // Ghi tất cả các cấp độ ở dev, chỉ ghi info trở lên ở prod
    format: consoleFormat,
  }),
];

// Chỉ ghi log ra file ở môi trường production
if (config.env === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error", // Chỉ ghi những lỗi nghiêm trọng
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
