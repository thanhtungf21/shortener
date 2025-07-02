import User from "../models/User.model.js";

class UserService {
  /**
   * Get all users from the database.
   * @returns {Promise<Array>} A list of users without their passwords.
   */
  async getAllUsers() {
    return await User.find({}).select("-password");
  }

  /**
   * Get a single user by their ID.
   * @param {string} id - The ID of the user.
   * @returns {Promise<Object>} The user object without the password.
   * @throws {Error} If the user is not found.
   */
  async getUserById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update a user's details by an admin.
   * @param {string} userId - The ID of the user to update.
   * @param {object} updateData - The data to update.
   * @param {string} [updateData.email] - The new email.
   * @param {string} [updateData.role] - The new role.
   * @returns {Promise<Object>} The updated user object.
   */
  async updateUser(userId, updateData) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    user.email = updateData.email ?? user.email;
    user.role = updateData.role ?? user.role;

    return await user.save();
  }
}

export default new UserService();
