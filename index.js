// index.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import redirectRoutes from './routes/redirect.routes.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';

dotenv.config();

const app = express();

// Sử dụng top-level await để kết nối DB, một ưu điểm của ESM!
try {
    await connectDB();
} catch (error) {
    console.error("Failed to connect to DB, exiting.", error);
    process.exit(1);
}


app.use(express.json());

app.use('/api', generalLimiter, apiRoutes);
app.use('/', redirectRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;