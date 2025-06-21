// src/utils/response.util.js

/**
 * Gửi response thành công chuẩn hóa
 * @param {object} res - Đối tượng response của Express
 * @param {number} statusCode - Mã trạng thái HTTP (ví dụ: 200, 201)
 * @param {object|array} data - Dữ liệu cần gửi đi
 * @param {string} message - Tin nhắn thông báo
 */
const sendSuccess = (res, statusCode, data, message) => {
    res.status(statusCode).json({
        success: true,
        data,
        message,
    });
};

/**
 * Gửi response lỗi chuẩn hóa
 * @param {object} res - Đối tượng response của Express
 * @param {number} statusCode - Mã trạng thái HTTP (ví dụ: 400, 404, 500)
 * @param {string} message - Tin nhắn lỗi
 */
const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        data: null,
        message,
    });
};

module.exports = {
    sendSuccess,
    sendError,
};