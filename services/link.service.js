// services/link.service.js

import Link from "../models/link.model.js";
import { nanoid } from "nanoid";
import { paginate } from "../utils/pagination.util.js";
import AppError from "../utils/appError.util.js";

export const getAllLinks = async (query) => {
  const paginatedResults = await paginate(Link, query);
  return paginatedResults;
};

export const createShortLink = async (originalUrl, customCode) => {
  // --- BỎ ĐI CÁC DÒNG VALIDATION CŨ ---
  // if (!originalUrl || !originalUrl.startsWith('http')) { ... }

  let shortCode;

  if (customCode) {
    const reservedWords = [
      "api",
      "public",
      "assets",
      "css",
      "js",
      "img",
      "favicon.ico",
    ];
    if (reservedWords.includes(customCode.toLowerCase())) {
      const error = new Error(`Tên tùy chọn '${customCode}' không được phép.`);
      error.statusCode = 400; // Vẫn giữ lại các lỗi nghiệp vụ
      throw error;
    }
    // --- BỎ ĐI KIỂM TRA REGEX CŨ ---
    // if (!/^[a-zA-Z0-9_-]+$/.test(customCode)) { ... }

    const existingLink = await Link.findOne({ shortCode: customCode });
    if (existingLink) {
      // Sử dụng AppError
      throw new AppError(`Tên tùy chọn '${customCode}' đã được sử dụng.`, 409);
    }
    shortCode = customCode;
  } else {
    shortCode = nanoid(7);
  }

  const newLink = new Link({ originalUrl, shortCode });
  await newLink.save();
  return newLink;
};
// ... phần còn lại của file giữ nguyên

export const getLinkByShortCode = async (shortCode) => {
  // Find the link and atomically increment the click count.
  // Using findOneAndUpdate is an atomic operation, which is safer for counters.
  const link = await Link.findOneAndUpdate(
    { shortCode },
    { $inc: { clicks: 1 } }
  );
  if (!link) {
    const error = new Error("Không tìm thấy link rút gọn.");
    error.statusCode = 404;
    throw error;
  }
  return link;
};
