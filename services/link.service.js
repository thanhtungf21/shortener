// src/services/link.service.js

const Link = require('../models/link.model');
const { nanoid } = require('nanoid');
const { paginate } = require('../utils/pagination.util');

/**
 * Service để lấy danh sách link có phân trang
 * @param {object} query - Query object từ request
 * @returns {Promise<object>}
 */
const getAllLinks = async (query) => {
    // Gọi hàm paginate tái sử dụng
    const paginatedResults = await paginate(Link, query);
    return paginatedResults;
};

/**
 * Service để tạo link rút gọn mới
 * @param {string} originalUrl - URL gốc
 * @returns {Promise<object>}
 */
const createShortLink = async (originalUrl) => {
    if (!originalUrl || !originalUrl.startsWith('http')) {
        // Ném ra một lỗi để Controller có thể bắt và xử lý
        const error = new Error('URL không hợp lệ.');
        error.statusCode = 400; // Gán statusCode để Controller biết
        throw error;
    }

    const shortCode = nanoid(7);
    const newLink = new Link({ originalUrl, shortCode });
    await newLink.save();
    return newLink;
};

/**
 * Service để lấy link gốc từ shortCode
 * @param {string} shortCode
 * @returns {Promise<object>}
 */
const getLinkByShortCode = async (shortCode) => {
    const link = await Link.findOne({ shortCode });
    if (!link) {
        const error = new Error('Không tìm thấy link rút gọn.');
        error.statusCode = 404;
        throw error;
    }
    return link;
};


module.exports = {
    getAllLinks,
    createShortLink,
    getLinkByShortCode,
};