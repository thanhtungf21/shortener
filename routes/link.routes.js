// routes/link.routes.js
import express from 'express';
import { createShortLink, getAllLinks } from '../controllers/link.controller.js';
import { createLinkLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.get('/', getAllLinks);
router.post('/shorten', createLinkLimiter, createShortLink);

export default router;