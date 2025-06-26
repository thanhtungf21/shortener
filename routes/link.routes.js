// routes/link.routes.js
import express from "express";
import {
  createShortLink,
  getAllLinks,
} from "../controllers/link.controller.js";
import { createLinkLimiter } from "../middlewares/rateLimiter.middleware.js";
import { validateLinkCreation } from "../middlewares/validator.middleware.js"; // <-- Import

const router = express.Router();

router.get("/", getAllLinks);
// Áp dụng middleware validation trước controller
router.post(
  "/shorten",
  createLinkLimiter,
  validateLinkCreation,
  createShortLink
);

export default router;
