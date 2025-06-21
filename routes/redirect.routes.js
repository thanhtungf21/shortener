// src/routes/redirect.routes.js

const express = require('express');
const { redirectToOriginalUrl } = require('../controllers/link.controller');
const router = express.Router();

// Route này sẽ bắt các truy cập ở root, ví dụ: yourdomain.com/abcdefg
router.get('/:shortCode', redirectToOriginalUrl);

module.exports = router;