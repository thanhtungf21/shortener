// services/link.service.js

import Link from '../models/link.model.js';
import { nanoid } from 'nanoid'; // XÓA DÒNG IMPORT TĨNH NÀY
import { paginate } from '../utils/pagination.util.js';

export const getAllLinks = async (query) => {
    const paginatedResults = await paginate(Link, query);
    return paginatedResults;
};

export const createShortLink = async (originalUrl, customCode) => {
    if (!originalUrl || !originalUrl.startsWith('http')) {
        const error = new Error('URL không hợp lệ.');
        error.statusCode = 400;
        throw error;
    }

    // SỬ DỤNG LẠI DYNAMIC IMPORT()
    // const { nanoid } = await import('nanoid');

    let shortCode;

    if (customCode) {
        const reservedWords = ['api', 'public', 'assets', 'css', 'js', 'img'];
        if (reservedWords.includes(customCode.toLowerCase())) {
            const error = new Error(`Tên tùy chọn '${customCode}' không được phép.`);
            error.statusCode = 400;
            throw error;
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(customCode)) {
            const error = new Error('Tên tùy chọn chỉ được chứa chữ, số, dấu gạch dưới và gạch ngang.');
            error.statusCode = 400;
            throw error;
        }

        const existingLink = await Link.findOne({ shortCode: customCode });
        if (existingLink) {
            const error = new Error(`Tên tùy chọn '${customCode}' đã được sử dụng.`);
            error.statusCode = 409;
            throw error;
        }
        shortCode = customCode;
    } else {
        shortCode = nanoid(7);
    }

    const newLink = new Link({ originalUrl, shortCode });
    await newLink.save();
    return newLink;
};

export const getLinkByShortCode = async (shortCode) => {
    const link = await Link.findOne({ shortCode });
    if (!link) {
        const error = new Error('Không tìm thấy link rút gọn.');
        error.statusCode = 404;
        throw error;
    }
    return link;
};