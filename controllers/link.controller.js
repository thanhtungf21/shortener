// controllers/link.controller.js
import * as linkService from '../services/link.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const getAllLinks = async (req, res) => {
    try {
        const result = await linkService.getAllLinks(req.query);
        sendSuccess(res, 200, result, 'Lấy danh sách link thành công.');
    } catch (error) {
        console.error('Controller Error:', error);
        sendError(res, error.statusCode || 500, error.message || 'Lỗi hệ thống.');
    }
};

export const createShortLink = async (req, res) => {
    try {
        // Lấy cả originalUrl và customCode từ body
        const { originalUrl, customCode } = req.body;
        const newLink = await linkService.createShortLink(originalUrl, customCode);

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

export const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const link = await linkService.getLinkByShortCode(shortCode);
        return res.redirect(301, link.originalUrl);
    } catch (error) {
        console.error('Controller Error:', error);
        sendError(res, error.statusCode || 500, error.message || 'Lỗi hệ thống.');
    }
};