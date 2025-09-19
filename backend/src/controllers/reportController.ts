import { Request, Response } from "express";
import { ReportService } from "../services/reportService";
import { ApiResponse } from "../types";

export class ReportController {
  static async getReports(req: Request, res: Response): Promise<void> {
    try {
      const reports = await ReportService.getReports();

      const response: ApiResponse = {
        success: true,
        message: "Reports retrieved successfully! 🎉",
        data: { reports },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to get reports! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }
}
