import Response from "../utils/response.util.js";

/**
 * Middleware để xử lý các route không tồn tại (404 Not Found).
 * Nó không trực tiếp gửi response mà tạo ra một lỗi và chuyển cho errorHandler.
 */
const notFound = (req, res, next) => {
  // Tạo một đối tượng Error mới
  const error = new Error(`Đường dẫn không tồn tại - ${req.originalUrl}`);
  // Đặt mã trạng thái cho response là 404
  res.status(404);
  // Chuyển lỗi này đến middleware xử lý lỗi tiếp theo (errorHandler)
  next(error);
};

/**
 * Middleware xử lý lỗi tập trung (Global Error Handler).
 * Đây là "tấm lưới" cuối cùng, bắt tất cả lỗi được truyền qua next(error).
 */
const errorHandler = (err, req, res, next) => {
  // Khởi tạo Response class
  const response = new Response(res);

  // Lấy statusCode từ đối tượng response. Nếu là 200 thì mặc định là lỗi server 500.
  // Điều này xử lý trường hợp một lỗi được throw mà chưa set status code.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Ghi lại log lỗi ra console để debug, đặc biệt là các lỗi 500
  if (statusCode >= 500) {
    console.error("SERVER ERROR:", err);
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
