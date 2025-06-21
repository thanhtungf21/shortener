// src/routes/link.routes.js

const express = require('express');
const { createShortLink, getAllLinks } = require('../controllers/link.controller');
const router = express.Router();

// GET /api/links/ -> Lấy danh sách tất cả links
router.get('/', getAllLinks);

// POST /api/links/shorten -> Tạo link mới
router.post('/shorten', createShortLink);

module.exports = router;