// utils/response.util.js

/**
 * Lớp Response để xử lý việc gửi phản hồi HTTP một cách nhất quán.
 * Giúp mã nguồn ở tầng controller trở nên rõ ràng và dễ đọc hơn.
 */
class Response {
  /**
   * @param {object} res - Đối tượng response của Express.
   */
  constructor(res) {
    this.res = res;
  }

  /**
   * Gửi phản hồi thành công chung.
   * @param {number} statusCode - Mã trạng thái HTTP.
   * @param {any} data - Dữ liệu trả về.
   * @param {string} message - Tin nhắn mô tả.
   */
  _send(statusCode, data, message) {
    const responseData = {
      success: statusCode >= 200 && statusCode < 300,
      data: data !== undefined ? data : null,
      message: message || "",
    };
    this.res.status(statusCode).json(responseData);
  }

  // --- PHẢN HỒI THÀNH CÔNG (2xx) ---

  /**
   * 200 OK - Phản hồi cho các request thành công.
   * @param {any} data - Dữ liệu trả về cho client.
   * @param {string} [message='Success'] - Tin nhắn.
   */
  ok(data, message = "Success") {
    this._send(200, data, message);
  }

  /**
   * 201 Created - Phản hồi sau khi một tài nguyên được tạo thành công.
   * @param {any} data - Dữ liệu của tài nguyên vừa được tạo.
   * @param {string} [message='Resource created successfully'] - Tin nhắn.
   */
  created(data, message = "Resource created successfully") {
    this._send(201, data, message);
  }

  /**
   * 204 No Content - Phản hồi khi request thành công nhưng không có nội dung trả về (ví dụ: sau khi xóa).
   */
  noContent() {
    this.res.status(204).send();
  }

  // --- PHẢN HỒI LỖI CLIENT (4xx) ---

  /**
   * 400 Bad Request - Request không hợp lệ.
   * @param {string} [message='Bad Request'] - Tin nhắn lỗi.
   * @param {any} [data=null] - Dữ liệu bổ sung về lỗi (ví dụ: lỗi validation).
   */
  badRequest(message = "Bad Request", data = null) {
    this._send(400, data, message);
  }

  /**
   * 401 Unauthorized - Lỗi xác thực, người dùng chưa đăng nhập.
   * @param {string} [message='Unauthorized'] - Tin nhắn lỗi.
   */
  unauthorized(message = "Unauthorized") {
    this._send(401, null, message);
  }

  /**
   * 403 Forbidden - Người dùng đã đăng nhập nhưng không có quyền truy cập.
   * @param {string} [message='Forbidden'] - Tin nhắn lỗi.
   */
  forbidden(message = "Forbidden") {
    this._send(403, null, message);
  }

  /**
   * 404 Not Found - Không tìm thấy tài nguyên được yêu cầu.
   * @param {string} [message='Resource not found'] - Tin nhắn lỗi.
   */
  notFound(message = "Resource not found") {
    this._send(404, null, message);
  }

  tooManyRequests(message = "Too many requests, please try again later") {
    this._send(429, null, message);
  }

  // --- PHẢN HỒI LỖI SERVER (5xx) ---

  /**
   * 500 Internal Server Error - Lỗi từ phía server.
   * @param {string} [message='Internal Server Error'] - Tin nhắn lỗi.
   */
  internalServerError(message = "Internal Server Error") {
    this._send(500, null, message);
  }
}

export default Response;
