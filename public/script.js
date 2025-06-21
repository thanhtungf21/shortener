document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shorten-form');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const shortUrlLink = document.getElementById('shortUrl');
    const copyBtn = document.getElementById('copy-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalUrl = document.getElementById('originalUrl').value;
        const customCode = document.getElementById('customCode').value;

        // Ẩn kết quả cũ
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        try {
            const response = await fetch('/api/links/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalUrl,
                    customCode: customCode || null, // Gửi null nếu không có custom code
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            // Hiển thị kết quả
            shortUrlLink.href = data.data.shortUrl;
            shortUrlLink.textContent = data.data.shortUrl.replace(/^https?:\/\//, '');
            resultDiv.classList.remove('hidden');

        } catch (err) {
            errorDiv.textContent = err.message || 'Đã có lỗi xảy ra.';
            errorDiv.classList.remove('hidden');
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shortUrlLink.href).then(() => {
            copyBtn.textContent = 'Đã chép!';
            setTimeout(() => {
                copyBtn.textContent = 'Sao chép';
            }, 2000);
        });
    });
});