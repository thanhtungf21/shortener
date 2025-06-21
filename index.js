// index.js

import express from 'express';
import dotenv from 'dotenv';
// import path from 'path'; // KHÔNG CẦN NỮA
// import { fileURLToPath } from 'url'; // KHÔNG CẦN NỮA

import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import redirectRoutes from './routes/redirect.routes.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';

// KHÔNG CẦN CÁC DÒNG NÀY NỮA
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

(async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Failed to connect to DB, exiting.", error);
        process.exit(1);
    }
})();
app.use(express.json());

// --- SẮP XẾP LẠI ROUTE ---

// 1. Phục vụ các file tĩnh trong thư mục 'public' một cách trực tiếp
// Khi server chạy từ thư mục gốc, Express sẽ tự động hiểu 'public' là thư mục con.
app.use(express.static('public'));

// 2. Đăng ký các route API
app.use('/api', generalLimiter, apiRoutes);

// 3. Route chuyển hướng phải được đặt CUỐI CÙNG
app.use('/', redirectRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;