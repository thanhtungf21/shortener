import express from "express";
import {
  getUsers,
  getUserProfile,
  updateUserByAdmin,
} from "../controllers/user.controller.js";
import { protect, admin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Nhóm các route lại cho dễ quản lý
router.route("/").get(protect, admin, getUsers);

router.route("/me").get(protect, getUserProfile);

router
  .route("/:id")
  // Thêm route cho admin cập nhật người dùng
  .put(protect, admin, updateUserByAdmin);

export default router;
