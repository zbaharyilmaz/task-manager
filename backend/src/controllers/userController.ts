import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { ApiResponse } from "../types";

export class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();

      const response: ApiResponse = {
        success: true,
        message: "Users retrieved successfully! 🎉",
        data: { users },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to get users! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);

      const response: ApiResponse = {
        success: true,
        message: "User retrieved successfully! 🎉",
        data: { user },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to get user! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async updateUserRole(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.updateUserRole(
        req.params.id,
        req.body.role
      );

      const response: ApiResponse = {
        success: true,
        message: "User role updated successfully! 🎉",
        data: { user },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to update user role! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id);

      const response: ApiResponse = {
        success: true,
        message: "User deleted successfully! 🎉",
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to delete user! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }
}
