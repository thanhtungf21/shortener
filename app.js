// app.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

// Import các thành phần của ứng dụng
import apiRoutes from "./routes/index.js";
import redirectRoutes from "./routes/redirect.routes.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
import {
  notFound,
  errorHandler,
} from "./middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";

// --- KHỞI TẠO APP VÀ CÁC BIẾN CẦN THIẾT ---
const app = express();

// --- CẤU HÌNH MIDDLEWARE ---
app.set("trust proxy", 1);
app.use(helmet());

// *** BẮT ĐẦU THAY ĐỔI CẤU HÌNH CORS ***

// Danh sách các tên miền được phép truy cập
const allowedOrigins = [
  "https://tungnt2.name.vn",
  "http://localhost:3000", // Cho môi trường dev
  "http://localhost:5173", // Cho môi trường dev với Vite/React
];

const corsOptions = {
  origin: (origin, callback) => {
    // Cho phép các request không có origin (như Postman) hoặc origin nằm trong danh sách
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Quan trọng: cho phép gửi cookie qua CORS
};

// **Quan trọng**: Xử lý các yêu cầu preflight OPTIONS
// Dòng này phải được đặt trước các cấu hình route khác
app.options("*", cors(corsOptions));

// Sử dụng middleware CORS cho tất cả các yêu cầu khác
app.use(cors(corsOptions));

// *** KẾT THÚC THAY ĐỔI CẤU HÌNH CORS ***

// 2. Parser và Logging
app.use(express.json()); // Middleware để parse JSON body
app.use(cookieParser());
if (config.env === "development") {
  app.use(morgan("dev")); // Ghi log request ở môi trường dev
}

// 3. Phục vụ file tĩnh
app.use(express.static(path.join(process.cwd(), "public")));

// --- CẤU HÌNH ROUTES ---
app.use("/api", generalLimiter, apiRoutes);
app.use("/", redirectRoutes);

// --- CẤU HÌNH XỬ LÝ LỖI (PHẢI ĐẶT Ở CUỐI CÙNG) ---
app.use(notFound);
app.use(errorHandler);

// --- EXPORT APP ---
export default app;
