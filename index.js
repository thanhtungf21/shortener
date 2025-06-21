// index.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path'; // Import path
import { fileURLToPath } from 'url'; // Import url

import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import redirectRoutes from './routes/redirect.routes.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';

// Cấu hình để sử dụng __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Sử dụng top-level await để kết nối DB
try {
    await connectDB();
} catch (error) {
    console.error("Failed to connect to DB, exiting.", error);
    process.exit(1);
}

app.use(express.json());

// --- SẮP XẾP LẠI ROUTE ---

// 1. Phục vụ các file tĩnh trong thư mục 'public'
// Khi người dùng truy cập '/', nó sẽ tự động tìm file 'index.html'
app.use(express.static(path.join(__dirname, 'public')));

// 2. Đăng ký các route API
app.use('/api', generalLimiter, apiRoutes);

// 3. Route chuyển hướng phải được đặt CUỐI CÙNG
// Nó sẽ bắt tất cả các request không khớp với các route ở trên
app.use('/', redirectRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;