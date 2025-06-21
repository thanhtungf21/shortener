// api/index.js

const express = require('express');
const { nanoid } = require('nanoid');

const app = express();

// Middleware để đọc JSON từ request body
app.use(express.json());

// "Cơ sở dữ liệu" tạm thời để lưu trữ link (chỉ tồn tại trong bộ nhớ)
// Khi deploy lên Vercel, mỗi lần function "ngủ" và "thức dậy", dữ liệu này sẽ mất.
// Để lưu trữ lâu dài, bạn cần dùng Vercel KV, Vercel Postgres hoặc một DB bên ngoài.
const linksStore = {};

// Endpoint 1: Tạo link rút gọn
// POST /api/shorten
app.post('/api/shorten', async (req, res) => {
    try {
        // Dùng import() động ở đây
        const { nanoid } = await import('nanoid');

        const { originalUrl } = req.body;

        if (!originalUrl || !originalUrl.startsWith('http')) {
            return res.status(400).json({ error: 'Valid URL is required.' });
        }

        const shortCode = nanoid(7);
        //... (phần còn lại của code giữ nguyên)
        linksStore[shortCode] = originalUrl;
        const host = req.headers.host;
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const shortUrl = `${protocol}://${host}/${shortCode}`;
        res.status(200).json({ shortUrl });
    } catch (error) {
        // Thêm một trình xử lý lỗi cơ bản
        console.error(error);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
});
// Endpoint 2: Chuyển hướng (Redirect) từ link rút gọn
// GET /:shortCode
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;

    // Tìm link gốc trong "cơ sở dữ liệu"
    const originalUrl = linksStore[shortCode];

    if (originalUrl) {
        console.log(`Redirecting ${shortCode} to ${originalUrl}`);
        // Nếu tìm thấy, thực hiện chuyển hướng 301 (Moved Permanently)
        return res.redirect(301, originalUrl);
    } else {
        // Nếu không tìm thấy, báo lỗi 404
        return res.status(404).json({ error: 'Short link not found.' });
    }
});

// Export app để Vercel có thể sử dụng
module.exports = app;