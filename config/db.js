// src/config/db.js

const mongoose = require('mongoose');

// Hàm kết nối đến cơ sở dữ liệu MongoDB
const connectDB = async () => {
    try {
        // Lấy chuỗi kết nối từ biến môi trường
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Thoát khỏi tiến trình với lỗi
        process.exit(1);
    }
};

module.exports = connectDB;