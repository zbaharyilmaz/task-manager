import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    myTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/tasks");
      const tasks = response.data.data.tasks;

      const myTasks = tasks.length;
      const completedTasks = tasks.filter(
        (task) => task.status === "done"
      ).length;
      const pendingTasks = tasks.filter(
        (task) => task.status !== "done"
      ).length;
      const overdueTasks = tasks.filter(
        (task) => new Date(task.dueDate) < new Date() && task.status !== "done"
      ).length;

      setStats({
        myTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      });

      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load dashboard data! 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully! 👋");
    navigate("/login");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
      });
      toast.success("Task status updated! ✨");
      fetchUserData(); // Refresh data
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status! 😢");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard... ⏳</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Dashboard 👤
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.name}! 🎉
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Logout 🚪
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.myTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overdueTasks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions 🚀
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/user/my-tasks"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition duration-200"
                >
                  <span className="text-2xl block mb-2">📝</span>
                  My Tasks
                </Link>
                <Link
                  to="/user/task-details/new"
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition duration-200"
                >
                  <span className="text-2xl block mb-2">👁️</span>
                  View Details
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Tasks 📋
              </h2>
              <div className="space-y-3">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status:{" "}
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              task.status === "done"
                                ? "bg-green-100 text-green-800"
                                : task.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {task.status !== "done" && (
                          <button
                            onClick={() => updateTaskStatus(task._id, "done")}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition duration-200"
                          >
                            Complete ✅
                          </button>
                        )}
                        <Link
                          to={`/user/task-details/${task._id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No tasks assigned yet! 🎯
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
