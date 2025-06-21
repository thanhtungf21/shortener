// index.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes/index');
const redirectRoutes = require('./src/routes/redirect.routes');
const { generalLimiter } = require('./src/middlewares/rateLimiter.middleware'); // <-- IMPORT

// Load các biến môi trường từ file .env
dotenv.config();

// Khởi tạo Express app
const app = express();

// Kết nối đến MongoDB
connectDB();

// Middleware để đọc JSON từ request body
app.use(express.json());

// Đăng ký các bộ định tuyến
// 1. Tất cả API sẽ có tiền tố /api
app.use('/api', generalLimiter, apiRoutes); // <-- THÊM generalLimiter vào đây

// 2. Đăng ký route chuyển hướng ở gốc.
// QUAN TRỌNG: Route này phải được đăng ký SAU các route API
// để nó không bắt nhầm các request như /api/links
app.use('/', redirectRoutes);


// Lấy port từ biến môi trường hoặc dùng port 5000 mặc định
const PORT = process.env.PORT || 5000;

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export app để Vercel có thể sử dụng
module.exports = app;