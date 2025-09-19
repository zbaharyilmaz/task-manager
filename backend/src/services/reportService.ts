import { Task } from "../models/Tasks";
import { User } from "../models/User";

export class ReportService {
  static async getReports(): Promise<any> {
    // Get basic statistics
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "done" });
    const pendingTasks = await Task.countDocuments({ status: { $ne: "done" } });
    const totalUsers = await User.countDocuments();

    // Get tasks by priority
    const tasksByPriority = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get tasks by status
    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    return {
      statistics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        totalUsers,
        completionRate:
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      },
      tasksByPriority,
      tasksByStatus,
      recentTasks,
    };
  }
}
