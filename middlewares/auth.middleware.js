import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Response from "../utils/response.util.js";

/**
 * @desc Middleware to protect routes that require authentication
 */
export const protect = async (req, res, next) => {
  const response = new Response(res);
  let token;

  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token payload
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return response.unauthorized("Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error(error);
      return response.unauthorized("Not authorized, token failed");
    }
  }

  if (!token) {
    return response.unauthorized("Not authorized, no token");
  }
};

/**
 * @desc Middleware to check for admin role
 */
export const admin = (req, res, next) => {
  const response = new Response(res);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    // You might need to add this `forbidden` method to your Response utility
    return response.forbidden("Not authorized as an admin");
  }
};
