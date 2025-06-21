// src/models/link.model.js

const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: [true, 'Original URL is required.'],
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
        },
        // Mongoose sẽ tự động quản lý `createdAt` và `updatedAt` từ đây
    },
    {
        // THÊM MỚI: Tùy chọn để Mongoose tự động thêm 2 trường createdAt và updatedAt
        timestamps: true
    }
);

// CẬP NHẬT: Thêm tham số thứ 3 để chỉ định tên collection là 'shorter_link'
// Nếu không có tham số này, Mongoose sẽ tự tạo collection tên là 'links'
module.exports = mongoose.model('Link', LinkSchema, 'shorter_link');