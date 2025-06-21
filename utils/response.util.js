// utils/response.util.js
export const sendSuccess = (res, statusCode, data, message) => {
    res.status(statusCode).json({
        success: true,
        data,
        message,
    });
};

export const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        data: null,
        message,
    });
};