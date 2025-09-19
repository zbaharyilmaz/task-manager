import { Task } from "../models/Tasks";
import { ITaskResponse, AppError } from "../types";

export class TaskService {
  private static formatTaskResponse(task: any): ITaskResponse {
    return {
      id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      createdBy: task.createdBy,
      checklist: task.checklist,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  static async getAllTasks(): Promise<ITaskResponse[]> {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
    return tasks.map((task) => this.formatTaskResponse(task));
  }

  static async createTask(
    taskData: any,
    createdBy: string
  ): Promise<ITaskResponse> {
    const task = await Task.create({
      ...taskData,
      createdBy,
    });

    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");

    return this.formatTaskResponse(task);
  }

  static async getTaskById(taskId: string): Promise<ITaskResponse> {
    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      throw new AppError("Task not found! 😢", 404);
    }

    return this.formatTaskResponse(task);
  }

  static async updateTask(
    taskId: string,
    updateData: any
  ): Promise<ITaskResponse> {
    const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      throw new AppError("Task not found! 😢", 404);
    }

    return this.formatTaskResponse(task);
  }

  static async updateTaskStatus(
    taskId: string,
    status: string
  ): Promise<ITaskResponse> {
    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      throw new AppError("Task not found! 😢", 404);
    }

    return this.formatTaskResponse(task);
  }

  static async deleteTask(taskId: string): Promise<void> {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError("Task not found! 😢", 404);
    }

    await Task.findByIdAndDelete(taskId);
  }
}
