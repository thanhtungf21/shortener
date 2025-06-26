// middlewares/validator.middleware.js
import { body, validationResult } from "express-validator";
import Response from "../utils/response.util.js";

// Hàm xử lý lỗi validation chung
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Lấy lỗi đầu tiên để hiển thị
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    const response = new Response(res);
    return response.badRequest(firstError, errors.array());
  }
  next();
};

// Quy tắc validation cho việc tạo link
export const validateLinkCreation = [
  body("originalUrl")
    .trim()
    .notEmpty()
    .withMessage("Original URL là bắt buộc.")
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("URL không hợp lệ. Phải bắt đầu bằng http:// hoặc https://"),

  body("customCode")
    .optional({ checkFalsy: true }) // Cho phép customCode là chuỗi rỗng hoặc null
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Tên tùy chọn phải từ 3 đến 20 ký tự.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Tên tùy chọn chỉ được chứa chữ, số, gạch dưới và gạch ngang."
    ),

  handleValidationErrors,
];

// Quy tắc validation cho đăng ký
export const validateRegistration = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email là bắt buộc.")
    .isEmail()
    .withMessage("Email không hợp lệ."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự."),

  handleValidationErrors,
];

// Quy tắc validation cho đăng nhập
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email là bắt buộc.")
    .isEmail()
    .withMessage("Email không hợp lệ."),

  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc."),

  handleValidationErrors,
];
