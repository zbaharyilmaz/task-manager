import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, IUserResponse } from "../types";
import { User } from "../models/User";
import { AppError } from "../types";

export class AuthService {
  private static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
  }

  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private static formatUserResponse(user: IUser): IUserResponse {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async registerUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "user";
  }): Promise<{ user: IUserResponse; token: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError("User already exists with this email! 😅", 400);
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user",
    });

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  static async loginUser(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: IUserResponse; token: string }> {
    // Find user
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new AppError("Invalid credentials! 😢", 400);
    }

    // Check password
    const isPasswordValid = await this.comparePassword(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials! 😢", 400);
    }

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  static async getUserProfile(userId: string): Promise<IUserResponse> {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new AppError("User not found! 😢", 404);
    }

    return this.formatUserResponse(user);
  }

  static async updateUserProfile(
    userId: string,
    updateData: {
      name?: string;
      email?: string;
      password?: string;
    }
  ): Promise<IUserResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found! 😢", 404);
    }

    // Update fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.password) {
      user.password = await this.hashPassword(updateData.password);
    }

    await user.save();

    return this.formatUserResponse(user);
  }
}
