// index.js

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan"; // <-- 1. Import morgan

import connectDB from "./config/db.js";
import apiRoutes from "./routes/index.js";
import redirectRoutes from "./routes/redirect.routes.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
// Giả sử bạn sẽ tạo file này ở Bước 3
import {
  notFound,
  errorHandler,
} from "./middlewares/errorHandler.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

try {
  await connectDB();
} catch (error) {
  console.error("Failed to connect to DB, exiting.", error);
  process.exit(1);
}

app.use(express.json());

// 2. Sử dụng morgan middleware để ghi log
// Chỉ sử dụng trong môi trường dev để tránh làm chậm production
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- SẮP XẾP LẠI ROUTE ---

app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api", generalLimiter, apiRoutes);

app.use("/", redirectRoutes);

// --- XỬ LÝ LỖI TẬP TRUNG ---
// Middleware bắt lỗi 404 và global error handler phải được đặt ở cuối cùng
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
