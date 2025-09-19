import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  updateUserRoleSchema,
  getUserByIdSchema,
  deleteUserSchema,
} from "../schemas/userSchemas";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get("/", authorize("admin"), UserController.getAllUsers);
router.get("/:id", validate(getUserByIdSchema), UserController.getUserById);
router.put(
  "/:id/role",
  authorize("admin"),
  validate(updateUserRoleSchema),
  UserController.updateUserRole
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(deleteUserSchema),
  UserController.deleteUser
);

export default router;
