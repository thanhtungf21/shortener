// index.js

import dotenv from "dotenv";
import app from "./app.js"; // <-- 1. Import app từ file app.js
import connectDB from "./config/db.js"; // <-- 2. Import hàm kết nối DB
import config from "./config/config.js"; // <-- Import

// 3. Tải các biến môi trường từ file .env
dotenv.config();

const PORT = process.env.PORT || 3000;

// Hàm chính để khởi động server
const startServer = async () => {
  try {
    // 4. Kết nối đến cơ sở dữ liệu
    await connectDB(config.mongoUri); // Truyền URI vào

    // 5. Khởi động server chỉ khi không chạy trên Vercel
    // Vercel sẽ tự quản lý việc khởi chạy server
    if (!config.isVercel) {
      app.listen(config.port, () => {
        console.log(`Server is running on http://localhost:${config.port}`);
        console.log(`Environment: ${config.env}`);
      });
    }
  } catch (error) {
    console.error("Failed to start the server.", error);
    process.exit(1); // Thoát tiến trình nếu không thể khởi động server
  }
};

// Gọi hàm để bắt đầu
startServer();

// 6. Export app cho Vercel
// Vercel cần export mặc định của đối tượng app để hoạt động
export default app;
