// src/utils/pagination.util.js

/**
 * Hàm phân trang có thể tái sử dụng cho bất kỳ Mongoose Model nào
 * @param {object} model - Mongoose model để thực hiện query
 * @param {object} query - Đối tượng query từ request (chứa page, limit)
 * @param {object} filter - (Tùy chọn) Đối tượng filter cho query
 * @returns {Promise<object>} - Trả về object chứa dữ liệu và thông tin phân trang
 */
const paginate = async (model, query, filter = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Thực hiện song song 2 query để tăng hiệu suất
    const [results, totalDocuments] = await Promise.all([
        model.find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip),
        model.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalDocuments / limit);

    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalDocuments,
            limit,
        },
    };
};

module.exports = { paginate };