import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { ApiResponse } from "../types";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.registerUser(req.body);

      const response: ApiResponse = {
        success: true,
        message: "User registered successfully! 🎉",
        data: result,
      };

      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Registration failed! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.loginUser(req.body);

      const response: ApiResponse = {
        success: true,
        message: "Logged in successfully! 🎉",
        data: result,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Login failed! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.getUserProfile(req.user!.id);

      const response: ApiResponse = {
        success: true,
        message: "Profile retrieved successfully! 🎉",
        data: user,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to get profile! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.updateUserProfile(req.user!.id, req.body);

      const response: ApiResponse = {
        success: true,
        message: "Profile updated successfully! 🎉",
        data: user,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: error.message || "Failed to update profile! 😢",
      };

      res.status(error.statusCode || 500).json(response);
    }
  }
}
