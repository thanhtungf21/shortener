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

    res.cookie("token", registeredUser.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 giờ
    });

    // 4. Sử dụng phương thức created() cho status 201
    return response.created(
      { _id: registeredUser._id, email: registeredUser.email },
      "User registered successfully"
    );
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

    res.cookie("token", loggedInUser.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 1 giờ
    });

    // 4. Sử dụng phương thức ok() cho status 200
    return response.ok(
      { _id: loggedInUser._id, email: loggedInUser.email },
      "Login successful"
    );
  } catch (error) {
    console.error(error);
    // 5. Xử lý lỗi linh hoạt
    if (error.statusCode === 401) {
      return response.unauthorized(error.message);
    }
    return response.internalServerError("Server error during login");
  }
};

export const logoutUser = (req, res) => {
  const response = new Response(res);

  // Gửi một cookie mới tên là 'token' với nội dung rỗng
  // và thời gian hết hạn trong quá khứ để xóa cookie hiện tại trên trình duyệt.
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Đặt thời gian hết hạn là một thời điểm trong quá khứ
    secure: process.env.NODE_ENV === "production", // Phải khớp với cài đặt khi đăng nhập
    sameSite: "strict", // Phải khớp với cài đặt khi đăng nhập
  });

  // Trả về thông báo thành công.
  return response.ok(null, "User logged out successfully.");
};
