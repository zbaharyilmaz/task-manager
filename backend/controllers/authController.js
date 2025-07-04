const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {};
const loginUser = async (req, res) => {};
const getUserProfile = async (req, res) => {};
const updateUserProfile = async (req, res) => {}
module.exports= {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
