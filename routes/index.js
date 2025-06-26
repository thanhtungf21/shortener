// routes/index.js
import express from "express";
import linkRoutes from "./link.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/links", linkRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
