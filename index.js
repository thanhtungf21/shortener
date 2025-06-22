// index.js

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import redirectRoutes from './routes/redirect.routes.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';

// Cấu hình `__dirname` không còn cần thiết cho việc phục vụ tệp tĩnh nữa,
// nhưng vẫn hữu ích nếu bạn cần nó ở nơi khác.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Sử dụng top-level await để đảm bảo kết nối DB thành công trước khi app khởi động.
try {
    await connectDB();
} catch (error) {
    console.error("Failed to connect to DB, exiting.", error);
    process.exit(1);
}

app.use(express.json());

// --- SẮP XẾP LẠI ROUTE ---

// 1. Phục vụ các file tĩnh trong thư mục 'public'
// Sử dụng process.cwd() để có đường dẫn gốc đáng tin cậy hơn trong môi trường Vercel.
// Vercel sẽ tự động tìm thư mục 'public' ở gốc dự án và phục vụ nó.
// Dòng này vẫn hữu ích cho việc phát triển ở môi trường local (máy tính cá nhân).
app.use(express.static(path.join(process.cwd(), 'public')));

// 2. Đăng ký các route API
app.use('/api', generalLimiter, apiRoutes);

// 3. Route chuyển hướng phải được đặt CUỐI CÙNG
app.use('/', redirectRoutes);


const PORT = process.env.PORT || 3000;

// Chỉ lắng nghe kết nối khi chạy local.
// Môi trường serverless của Vercel sẽ tự động quản lý vòng đời của server.
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;