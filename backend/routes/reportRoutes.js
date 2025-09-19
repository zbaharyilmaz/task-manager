const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

// Placeholder routes - implement as needed
router.get("/", protect, (req, res) => {
  res.json({ message: "Report routes working" });
});

module.exports = router;
