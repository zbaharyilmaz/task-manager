import { Document } from "mongoose";

// User types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

// Task types
export interface IChecklistItem {
  text: string;
  completed: boolean;
}

export interface ITask extends Document {
  _id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  dueDate: Date;
  assignedTo: string;
  createdBy: string;
  checklist: IChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskResponse {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  dueDate: Date;
  assignedTo: IUserResponse;
  createdBy: IUserResponse;
  checklist: IChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// JWT types
export interface JWTPayload {
  id: string;
  email: string;
  role: "admin" | "user";
  iat: number;
  exp: number;
}

// Request types
export interface AuthenticatedRequest extends Request {
  user?: IUserResponse;
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Export AppError class
export { AppError } from "../utils/AppError";
