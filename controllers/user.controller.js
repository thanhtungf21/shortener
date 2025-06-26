import userService from "../services/user.service.js";
import Response from "../utils/response.util.js";

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  const response = new Response(res);
  try {
    const users = await userService.getAllUsers();
    return response.ok(users, "Successfully retrieved all users");
  } catch (error) {
    console.error(error);
    return response.internalServerError("Server error while getting users");
  }
};
/**
 * @desc    Get user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  const response = new Response(res);
  try {
    // Logic đã được chuyển vào service
    const user = await userService.getUserById(req.user._id);
    return response.ok(user, "Successfully retrieved user profile");
  } catch (error) {
    console.error(error);
    if (error.statusCode === 404) {
      return response.notFound(error.message);
    }
    return response.internalServerError(
      "Server error while getting user profile"
    );
  }
};

/**
 * @desc    Update user by admin
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUserByAdmin = async (req, res) => {
  const response = new Response(res);
  try {
    const userId = req.params.id;
    const { email, role } = req.body;

    const updatedUser = await userService.updateUser(userId, { email, role });

    // Trả về thông tin người dùng đã cập nhật (không bao gồm mật khẩu)
    const userToReturn = {
      _id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    return response.ok(userToReturn, "User updated successfully");
  } catch (error) {
    console.error(error);
    if (error.statusCode === 404) {
      return response.notFound(error.message);
    }
    return response.internalServerError("Server error while updating user");
  }
};
