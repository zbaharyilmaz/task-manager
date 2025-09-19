const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

// User routes
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id/role", protect, updateUserRole);
router.delete("/:id", protect, deleteUser);

module.exports = router;
