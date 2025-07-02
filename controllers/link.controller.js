import * as linkService from "../services/link.service.js";
import Response from "../utils/response.util.js"; // 1. Import Response class

export const getAllLinks = async (req, res) => {
  const response = new Response(res); // 2. Khởi tạo response
  try {
    const result = await linkService.getAllLinks(req.query);
    // 3. Sử dụng ok()
    return response.ok(result, "Lấy danh sách link thành công.");
  } catch (error) {
    console.error("Controller Error:", error);
    // 4. Sử dụng internalServerError() cho lỗi chung
    return response.internalServerError(error.message || "Lỗi hệ thống.");
  }
};

export const createShortLink = async (req, res) => {
  const response = new Response(res); // 2. Khởi tạo response
  try {
    const { originalUrl, customCode } = req.body;
    const newLink = await linkService.createShortLink(originalUrl, customCode);

    const host = req.get("host");
    const protocol = req.protocol;
    const shortUrl = `${protocol}://${host}/${newLink.shortCode}`;

    const data = {
      originalUrl: newLink.originalUrl,
      shortUrl: shortUrl,
      shortCode: newLink.shortCode,
      clicks: newLink.clicks,
    };
    // 3. Sử dụng created()
    return response.created(data, "Tạo link rút gọn thành công.");
  } catch (error) {
    console.error("Controller Error:", error);
    // 4. Xử lý lỗi linh hoạt
    if (error.statusCode === 400) {
      return response.badRequest(error.message);
    }
    return response.internalServerError(error.message || "Lỗi hệ thống.");
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  const response = new Response(res); // 2. Khởi tạo response
  try {
    const { shortCode } = req.params;

    if (shortCode === "favicon.ico") {
      // 3. Sử dụng noContent() cho status 204
      return response.noContent();
    }

    const link = await linkService.getLinkByShortCode(shortCode);

    // LƯU Ý: res.redirect là một hành động đặc biệt, không phải là JSON response.
    // Vì vậy, chúng ta giữ nguyên nó. Class Response của chúng ta chỉ dành cho API trả về JSON.
    return res.redirect(302, link.originalUrl);
  } catch (error) {
    if (error.statusCode !== 404) {
      console.error("Controller Error:", error);
    }
    // 4. Xử lý lỗi 404 và các lỗi khác một cách rõ ràng
    if (error.statusCode === 404) {
      return response.notFound(error.message);
    }
    return response.internalServerError(error.message || "Lỗi hệ thống.");
  }
};
