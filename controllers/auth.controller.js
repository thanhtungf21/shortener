import authService from "../services/auth.service.js";
import Response from "../utils/response.util.js"; // 1. Import Response class

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const response = new Response(res); // 2. Khởi tạo response
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // 3. Sử dụng phương thức badRequest()
      return response.badRequest("Please enter all fields");
    }

    const registeredUser = await authService.register({ email, password });
    // 4. Sử dụng phương thức created() cho status 201
    return response.created(registeredUser, "User registered successfully");
  } catch (error) {
    console.error(error);
    // 5. Xử lý lỗi linh hoạt
    if (error.statusCode === 400) {
      return response.badRequest(error.message);
    }
    return response.internalServerError("Server error during registration");
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const response = new Response(res); // 2. Khởi tạo response
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // 3. Sử dụng phương thức badRequest()
      return response.badRequest("Please enter all fields");
    }

    const loggedInUser = await authService.login({ email, password });
    // 4. Sử dụng phương thức ok() cho status 200
    return response.ok(loggedInUser, "Login successful");
  } catch (error) {
    console.error(error);
    // 5. Xử lý lỗi linh hoạt
    if (error.statusCode === 401) {
      return response.unauthorized(error.message);
    }
    return response.internalServerError("Server error during login");
  }
};
