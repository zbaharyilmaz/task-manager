const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");

router.get("/profile", protect, getUserProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);

module.exports = router;