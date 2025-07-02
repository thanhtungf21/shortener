// middlewares/errorHandler.middleware.js
import Response from "../utils/response.util.js";
import logger from "../utils/logger.util.js";

const notFound = (req, res, next) => {
  const error = new Error(`Đường dẫn không tồn tại - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const response = new Response(res);
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Ghi lại log lỗi ra console để debug, đặc biệt là các lỗi 500
  if (statusCode >= 500) {
    // Thay thế console.error bằng logger.error
    logger.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
  }

  // Sử dụng switch case để gọi phương thức phù hợp từ Response class
  switch (statusCode) {
    case 400:
      return response.badRequest(err.message);
    case 401:
      return response.unauthorized(err.message);
    case 403:
      return response.forbidden(err.message);
    case 404:
      return response.notFound(err.message);
    case 429:
      return response.tooManyRequests(err.message);
    default:
      // Che giấu thông điệp lỗi chi tiết ở môi trường production để bảo mật
      const message =
        process.env.NODE_ENV === "production"
          ? "Đã có lỗi xảy ra ở phía máy chủ."
          : err.message;
      return response.internalServerError(message);
  }
};

export { notFound, errorHandler };
