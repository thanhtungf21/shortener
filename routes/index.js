// routes/index.js
import express from 'express';
import linkRoutes from './link.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.use('/links', linkRoutes);
router.use('/auth', authRoutes);

export default router;