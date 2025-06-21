// src/middlewares/rateLimiter.middleware.js

const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/response.util');

// Cấu hình chung cho hầu hết các API
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 15, // Giới hạn mỗi IP chỉ được 100 requests trong 15 phút
    standardHeaders: true, // Trả về thông tin giới hạn trong header `RateLimit-*`
    legacyHeaders: false, // Tắt các header cũ `X-RateLimit-*`
    handler: (req, res, next, options) => {
        // Tùy chỉnh response khi vượt giới hạn
        sendError(res, options.statusCode, `Quá nhiều yêu cầu được gửi từ IP này, vui lòng thử lại sau ${Math.ceil(options.windowMs / 60000)} phút.`);
    }
});

// Cấu hình khắt khe hơn cho việc tạo link mới để chống spam
const createLinkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 10, // Giới hạn mỗi IP chỉ được tạo 10 link trong 15 phút
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        sendError(res, options.statusCode, `Bạn đã tạo quá nhiều link, vui lòng thử lại sau ${Math.ceil(options.windowMs / 60000)} phút.`);
    },
    message: "Bạn đã tạo quá nhiều link, vui lòng thử lại sau 15 phút." // Message mặc định nếu không có handler
});

module.exports = {
    generalLimiter,
    createLinkLimiter,
};