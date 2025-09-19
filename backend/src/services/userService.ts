import { User } from "../models/User";
import { IUserResponse, AppError } from "../types";

export class UserService {
  private static formatUserResponse(user: any): IUserResponse {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async getAllUsers(): Promise<IUserResponse[]> {
    const users = await User.find().select("-password");
    return users.map((user) => this.formatUserResponse(user));
  }

  static async getUserById(userId: string): Promise<IUserResponse> {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new AppError("User not found! 😢", 404);
    }
    return this.formatUserResponse(user);
  }

  static async updateUserRole(
    userId: string,
    role: "admin" | "user"
  ): Promise<IUserResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found! 😢", 404);
    }

    user.role = role;
    await user.save();

    return this.formatUserResponse(user);
  }

  static async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found! 😢", 404);
    }

    await User.findByIdAndDelete(userId);
  }
}
