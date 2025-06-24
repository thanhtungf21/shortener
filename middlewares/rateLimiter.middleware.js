import rateLimit from "express-rate-limit";
import Response from "../utils/response.util.js"; // 1. Import Response class

const rateLimitHandler = (req, res, next, options, message) => {
  const response = new Response(res); // 2. Khởi tạo response
  // 3. Sử dụng phương thức tooManyRequests() mới
  response.tooManyRequests(message);
};

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) =>
    rateLimitHandler(
      req,
      res,
      next,
      options,
      `Quá nhiều yêu cầu được gửi từ IP này, vui lòng thử lại sau ${Math.ceil(
        options.windowMs / 60000
      )} phút.`
    ),
});

export const createLinkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) =>
    rateLimitHandler(
      req,
      res,
      next,
      options,
      `Bạn đã tạo quá nhiều link, vui lòng thử lại sau ${Math.ceil(
        options.windowMs / 60000
      )} phút.`
    ),
});
