// services/link.service.js
import Link from '../models/link.model.js';
import { nanoid } from 'nanoid'; // <-- Thay đổi quan trọng!
import { paginate } from '../utils/pagination.util.js';


const reservedWords = ['api', 'public', 'assets', 'css', 'js', 'img'];

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

    let shortCode;

    if (customCode) {
        // 1. Validate customCode
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

        // 2. Kiểm tra customCode đã tồn tại chưa
        const existingLink = await Link.findOne({ shortCode: customCode });
        if (existingLink) {
            const error = new Error(`Tên tùy chọn '${customCode}' đã được sử dụng.`);
            error.statusCode = 409; // 409 Conflict
            throw error;
        }
        shortCode = customCode;
    } else {
        // 3. Nếu không có customCode, tạo ngẫu nhiên
        shortCode = nanoid(7);
    }

    const newLink = new Link({ originalUrl, shortCode });
    await newLink.save();
    return newLink;
}

export const getLinkByShortCode = async (shortCode) => {
    const link = await Link.findOne({ shortCode });
    if (!link) {
        const error = new Error('Không tìm thấy link rút gọn.');
        error.statusCode = 404;
        throw error;
    }
    return link;
};