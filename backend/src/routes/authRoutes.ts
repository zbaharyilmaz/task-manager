import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../schemas/authSchemas";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);

// Protected routes
router.get("/profile", authenticate, AuthController.getProfile);
router.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  AuthController.updateProfile
);

export default router;
