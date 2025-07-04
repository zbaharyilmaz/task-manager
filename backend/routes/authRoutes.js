const express= require("express");
const router= express.Router();
router.get("/profile", protect, getUserProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);
module.exports= router;