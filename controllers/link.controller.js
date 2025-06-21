// src/controllers/link.controller.js

const linkService = require('../services/link.service');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * @desc    Lấy danh sách tất cả các link (có phân trang)
 * @route   GET /api/links
 */
const getAllLinks = async (req, res) => {
    try {
        // Controller chỉ cần gọi Service và truyền vào tham số cần thiết
        const result = await linkService.getAllLinks(req.query);
        sendSuccess(res, 200, result, 'Lấy danh sách link thành công.');
    } catch (error) {
        console.error('Controller Error:', error);
        sendError(res, error.statusCode || 500, error.message || 'Lỗi hệ thống.');
    }
};

/**
 * @desc    Tạo một link rút gọn mới
 * @route   POST /api/links/shorten
 */
const createShortLink = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        const newLink = await linkService.createShortLink(originalUrl);

        // Tạo shortUrl đầy đủ để trả về client
        const host = req.get('host');
        const protocol = req.protocol;
        const shortUrl = `${protocol}://${host}/${newLink.shortCode}`;

        const data = {
            originalUrl: newLink.originalUrl,
            shortUrl: shortUrl,
            shortCode: newLink.shortCode,
        };

        sendSuccess(res, 201, data, 'Tạo link rút gọn thành công.');
    } catch (error) {
        console.error('Controller Error:', error);
        sendError(res, error.statusCode || 500, error.message || 'Lỗi hệ thống.');
    }
};

/**
 * @desc    Chuyển hướng từ shortCode đến original URL
 * @route   GET /:shortCode
 */
const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const link = await linkService.getLinkByShortCode(shortCode);
        return res.redirect(301, link.originalUrl);
    } catch (error) {
        console.error('Controller Error:', error);
        // Với trường hợp redirect, ta có thể trả về lỗi dạng JSON hoặc render một trang 404
        sendError(res, error.statusCode || 500, error.message || 'Lỗi hệ thống.');
    }
};

module.exports = {
    getAllLinks,
    createShortLink,
    redirectToOriginalUrl,
};