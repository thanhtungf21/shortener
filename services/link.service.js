// services/link.service.js
import Link from '../models/link.model.js';
import { nanoid } from 'nanoid'; // <-- Thay đổi quan trọng!
import { paginate } from '../utils/pagination.util.js';

export const getAllLinks = async (query) => {
    const paginatedResults = await paginate(Link, query);
    return paginatedResults;
};

export const createShortLink = async (originalUrl) => {
    if (!originalUrl || !originalUrl.startsWith('http')) {
        const error = new Error('URL không hợp lệ.');
        error.statusCode = 400;
        throw error;
    }
    const shortCode = nanoid(7);
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