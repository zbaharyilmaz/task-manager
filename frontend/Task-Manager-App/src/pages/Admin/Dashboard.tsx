import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { tasks, fetchTasks, getStats } = useTaskStore();
  const { users, fetchUsers } = useUserStore();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([fetchTasks(), fetchUsers()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data! 😢");
      }
    };

    loadDashboardData();
  }, [fetchTasks, fetchUsers]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully! 👋");
    navigate("/login");
  };

  const stats = getStats();
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-white/80 text-lg">
                Welcome back,{" "}
                <span className="font-semibold">{user?.name}</span>! 👋
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-600/80 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Logout
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
                <span className="text-3xl">📊</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">
                  {stats.totalTasks}
                </div>
                <div className="text-white/70 text-sm font-medium">
                  Total Tasks
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
                    stats.totalTasks > 0
                      ? (stats.completedTasks / stats.totalTasks) * 100
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
                    stats.totalTasks > 0
                      ? (stats.pendingTasks / stats.totalTasks) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-3xl">👥</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">
                  {users.length}
                </div>
                <div className="text-white/70 text-sm font-medium">Users</div>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full w-full"></div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <span className="mr-3">⚡</span> Quick Actions
              </h2>
              <div className="space-y-4">
                <Link
                  to="/admin/create-task"
                  className="flex items-center p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                >
                  <div className="p-3 bg-blue-500/20 rounded-lg mr-4 group-hover:bg-blue-500/30 transition-colors">
                    <span className="text-2xl">➕</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      Create Task
                    </div>
                    <div className="text-white/60 text-sm">Add a new task</div>
                  </div>
                </Link>
                <Link
                  to="/admin/tasks"
                  className="flex items-center p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                >
                  <div className="p-3 bg-green-500/20 rounded-lg mr-4 group-hover:bg-green-500/30 transition-colors">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      Manage Tasks
                    </div>
                    <div className="text-white/60 text-sm">View all tasks</div>
                  </div>
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                >
                  <div className="p-3 bg-purple-500/20 rounded-lg mr-4 group-hover:bg-purple-500/30 transition-colors">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      Manage Users
                    </div>
                    <div className="text-white/60 text-sm">User management</div>
                  </div>
                </Link>
                <Link
                  to="/admin/reports"
                  className="flex items-center p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                >
                  <div className="p-3 bg-orange-500/20 rounded-lg mr-4 group-hover:bg-orange-500/30 transition-colors">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      Reports
                    </div>
                    <div className="text-white/60 text-sm">
                      Analytics & insights
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <span className="mr-3">📋</span> Recent Tasks
              </h3>
              <div className="space-y-4">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task, index) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4"></div>
                        <div>
                          <p className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors">
                            {task.title}
                          </p>
                          <p className="text-white/60 text-sm">
                            Status:{" "}
                            <span className="font-medium text-white/80 capitalize">
                              {task.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/admin/task-details/${task._id}`}
                        className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors group-hover:scale-110 transform"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-white/80 text-xl mb-2">No tasks yet</p>
                    <p className="text-white/60 text-sm">
                      Create your first task to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
