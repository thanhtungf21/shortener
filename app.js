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

// --- KHỞI TẠO APP VÀ CÁC BIẾN CẦN THIẾT ---
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CẤU HÌNH MIDDLEWARE ---

// 1. Bảo mật
// Sử dụng Helmet để thiết lập các HTTP Headers bảo mật
app.use(helmet());

// Cấu hình CORS
const corsOptions = {
  origin:
    config.env === "production" ? config.corsDomain : "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 2. Parser và Logging
app.use(express.json()); // Middleware để parse JSON body
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Ghi log request ở môi trường dev
}

// 3. Phục vụ file tĩnh
// Serve các file trong thư mục 'public' (CSS, JS, images,...)
app.use(express.static(path.join(process.cwd(), "public")));

// --- CẤU HÌNH ROUTES ---

// Áp dụng rate limiter chung cho các API routes
app.use("/api", generalLimiter, apiRoutes);

// Route xử lý việc chuyển hướng cho link rút gọn
app.use("/", redirectRoutes);

// --- CẤU HÌNH XỬ LÝ LỖI (PHẢI ĐẶT Ở CUỐI CÙNG) ---

// Middleware bắt lỗi 404 cho các route không tồn tại
app.use(notFound);

// Middleware xử lý lỗi tập trung
app.use(errorHandler);

// --- EXPORT APP ---
export default app;
