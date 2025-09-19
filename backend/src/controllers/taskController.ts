import { Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { ApiResponse } from "../types";

export class TaskController {
  static async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await TaskService.getAllTasks();

      const response: ApiResponse = {
        success: true,
        message: "Tasks retrieved successfully! 🎉",
        data: { tasks },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to get tasks! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await TaskService.createTask(req.body, req.user!.id);

      const response: ApiResponse = {
        success: true,
        message: "Task created successfully! 🎉",
        data: { task },
      };

      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to create task! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const task = await TaskService.getTaskById(req.params.id);

      const response: ApiResponse = {
        success: true,
        message: "Task retrieved successfully! 🎉",
        data: { task },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to get task! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body);

      const response: ApiResponse = {
        success: true,
        message: "Task updated successfully! 🎉",
        data: { task },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to update task! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const task = await TaskService.updateTaskStatus(
        req.params.id,
        req.body.status
      );

      const response: ApiResponse = {
        success: true,
        message: "Task status updated successfully! 🎉",
        data: { task },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to update task status! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      await TaskService.deleteTask(req.params.id);

      const response: ApiResponse = {
        success: true,
        message: "Task deleted successfully! 🎉",
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to delete task! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }
}
