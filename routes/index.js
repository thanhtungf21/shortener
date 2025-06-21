// routes/index.js
import express from 'express';
import linkRoutes from './link.routes.js';

const router = express.Router();

router.use('/links', linkRoutes);

export default router;