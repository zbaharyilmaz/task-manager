const User = require("../models/User");

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! Only admins can view all users! 🚫",
      });
    }

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully! 👥",
      data: { users, count: users.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users! 😢",
      error: error.message,
    });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found! 🤷‍♂️",
      });
    }

    // Check permissions
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied! 🚫",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully! 👤",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user! 😢",
      error: error.message,
    });
  }
};

// Update User Role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! Only admins can update user roles! 🚫",
      });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found! 🤷‍♂️",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully! 👑",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user role! 😢",
      error: error.message,
    });
  }
};

// Delete User (Admin only)
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! Only admins can delete users! 🚫",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found! 🤷‍♂️",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully! 🗑️",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user! 😢",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
