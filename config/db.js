// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Xóa object chứa các option cũ đi
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Dòng này rất quan trọng để in ra lỗi kết nối như bạn thấy
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;