import { Router } from "express";
import { ReportController } from "../controllers/reportController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get("/", authorize("admin"), ReportController.getReports);

export default router;
