import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.util.js";

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

class AuthService {
  /**
   * Registers a new user.
   * @param {object} userData - The user data.
   * @param {string} userData.email - The email.
   * @param {string} userData.password - The password.
   * @returns {Promise<object>} The created user object with a token.
   */
  async register(userData) {
    const { email, password } = userData;

    const userExists = await User.findOne({ $or: [{ email }] });
    if (userExists) {
      throw new AppError("User with that email already exists", 400);
    }

    const user = await User.create({ email, password });
    if (!user || !(await user.matchPassword(password))) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken(user._id);
    return { _id: user._id, email: user.email, token };
  }

  /**
   * Logs in a user.
   * @param {object} credentials - The user credentials.
   * @param {string} credentials.email - The user's email.
   * @param {string} credentials.password - The user's password.
   * @returns {Promise<object>} The user object with a token.
   */
  async login(credentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);
    return { _id: user._id, email: user.email, token };
  }
}

export default new AuthService();
