import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";

const ManageTasks = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { tasks, fetchTasks, deleteTask, updateTaskStatus } = useTaskStore();
  const loading = useTaskStore((state) => state.loading);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully! 👋");
    navigate("/login");
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const result = await deleteTask(taskId);
      if (result.success) {
        toast.success("Task deleted! 🗑️");
      } else {
        toast.error(result.error || "Failed to delete task! 😢");
      }
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    const result = await updateTaskStatus(taskId, newStatus);
    if (result.success) {
      toast.success("Task status updated! ✨");
    } else {
      toast.error(result.error || "Failed to update status! 😢");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        <div className="relative p-8 bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Loading tasks... ⏳</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden p-8">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 p-6 bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Tasks</h1>
            <p className="text-white/80 text-lg">Task management panel</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/admin/create-task"
              className="px-6 py-3 bg-green-500/80 text-white rounded-xl hover:bg-green-600/80 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-md"
            >
              Create Task ➕
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-md"
            >
              Logout 🚪
            </button>
          </div>
        </header>

        {/* Tasks Table */}
        <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8">All Tasks 📋</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6">Title</th>
                  <th className="text-left py-4 px-6">Priority</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Due Date</th>
                  <th className="text-left py-4 px-6">Assigned To</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="py-4 px-6 font-medium">{task.title}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          task.priority === "high"
                            ? "bg-red-500/80 text-white"
                            : task.priority === "medium"
                            ? "bg-yellow-500/80 text-white"
                            : "bg-green-500/80 text-white"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            task.id,
                            e.target.value as "todo" | "in-progress" | "done"
                          )
                        }
                        className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
                      >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {task.assignedTo?.name || "Unassigned"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/task-details/${task.id}`}
                          className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="bg-red-500/80 hover:bg-red-600/80 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTasks;
