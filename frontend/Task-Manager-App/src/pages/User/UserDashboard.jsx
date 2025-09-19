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
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">
            Loading your dashboard... ⏳
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                My Dashboard 👤
              </h1>
              <p className="text-white/80 text-lg">
                Welcome back, <span className="font-semibold">{user.name}</span>
                ! 🎉
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-600/80 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Logout 🚪
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <span className="text-3xl">📋</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">
                  {stats.myTasks}
                </div>
                <div className="text-white/70 text-sm font-medium">
                  My Tasks
                </div>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full w-full"></div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <span className="text-3xl">✅</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">
                  {stats.completedTasks}
                </div>
                <div className="text-white/70 text-sm font-medium">
                  Completed
                </div>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full"
                style={{
                  width: `${
                    stats.myTasks > 0
                      ? (stats.completedTasks / stats.myTasks) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <span className="text-3xl">⏳</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">
                  {stats.pendingTasks}
                </div>
                <div className="text-white/70 text-sm font-medium">Pending</div>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{
                  width: `${
                    stats.myTasks > 0
                      ? (stats.pendingTasks / stats.myTasks) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <span className="text-3xl">⚠️</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">
                  {stats.overdueTasks}
                </div>
                <div className="text-white/70 text-sm font-medium">Overdue</div>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 rounded-full"
                style={{
                  width: `${
                    stats.myTasks > 0
                      ? (stats.overdueTasks / stats.myTasks) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <span className="mr-3">🚀</span> Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/user/my-tasks"
                className="flex items-center p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <div className="p-3 bg-blue-500/20 rounded-lg mr-4 group-hover:bg-blue-500/30 transition-colors">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    My Tasks
                  </div>
                  <div className="text-white/60 text-sm">
                    View all your tasks
                  </div>
                </div>
              </Link>
              <Link
                to="/user/task-details/new"
                className="flex items-center p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <div className="p-3 bg-green-500/20 rounded-lg mr-4 group-hover:bg-green-500/30 transition-colors">
                  <span className="text-2xl">👁️</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    View Details
                  </div>
                  <div className="text-white/60 text-sm">
                    Task details and info
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <span className="mr-3">📋</span> Recent Tasks
            </h3>
            <div className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg group-hover:text-emerald-300 transition-colors">
                        {task.title}
                      </p>
                      <p className="text-white/60 text-sm mb-2">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.status === "done"
                              ? "bg-green-500/20 text-green-300"
                              : task.status === "in-progress"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {task.status !== "done" && (
                        <button
                          onClick={() => updateTaskStatus(task._id, "done")}
                          className="bg-green-500/80 hover:bg-green-600/80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          Complete ✅
                        </button>
                      )}
                      <Link
                        to={`/user/task-details/${task._id}`}
                        className="text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-colors group-hover:scale-110 transform"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-white/80 text-xl mb-2">
                    No tasks assigned yet!
                  </p>
                  <p className="text-white/60 text-sm">
                    You'll see your tasks here when they're assigned
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
