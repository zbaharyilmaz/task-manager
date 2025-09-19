import { Router } from "express";
import { TaskController } from "../controllers/taskController";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../schemas/taskSchemas";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Task routes
router.get("/", TaskController.getAllTasks);
router.post(
  "/",
  authorize("admin"),
  validate(createTaskSchema),
  TaskController.createTask
);
router.get("/:id", TaskController.getTaskById);
router.put(
  "/:id",
  authorize("admin"),
  validate(updateTaskSchema),
  TaskController.updateTask
);
router.patch(
  "/:id/status",
  validate(updateTaskStatusSchema),
  TaskController.updateTaskStatus
);
router.delete("/:id", authorize("admin"), TaskController.deleteTask);

export default router;
