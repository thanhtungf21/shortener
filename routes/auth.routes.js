// routes/auth.routes.js
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
// Import các middleware validation
import {
  validateRegistration,
  validateLogin,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", logoutUser);
export default router;
