// middlewares/rateLimiter.middleware.js
import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response.util.js';

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        sendError(res, options.statusCode, `Quá nhiều yêu cầu được gửi từ IP này, vui lòng thử lại sau ${Math.ceil(options.windowMs / 60000)} phút.`);
    }
});

export const createLinkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        sendError(res, options.statusCode, `Bạn đã tạo quá nhiều link, vui lòng thử lại sau ${Math.ceil(options.windowMs / 60000)} phút.`);
    },
});