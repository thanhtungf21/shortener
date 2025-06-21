// routes/redirect.routes.js
import express from 'express';
import { redirectToOriginalUrl } from '../controllers/link.controller.js';

const router = express.Router();

router.get('/:shortCode', redirectToOriginalUrl);

export default router;