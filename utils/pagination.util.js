// utils/pagination.util.js
export const paginate = async (model, query, filter = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

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