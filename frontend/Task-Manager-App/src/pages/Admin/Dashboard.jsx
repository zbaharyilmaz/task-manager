import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalUsers: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        axiosInstance.get("/tasks"),
        axiosInstance.get("/users"),
      ]);

      const tasks = tasksResponse.data.data.tasks;
      const users = usersResponse.data.data.users;

      const completedTasks = tasks.filter(
        (task) => task.status === "done"
      ).length;
      const pendingTasks = tasks.filter(
        (task) => task.status !== "done"
      ).length;

      setStats({
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        totalUsers: users.length,
      });

      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalTasks}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.completedTasks}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {stats.pendingTasks}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-gray-600">Users</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/admin/create-task"
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Create Task
                </Link>
                <Link
                  to="/admin/tasks"
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Manage Tasks
                </Link>
                <Link
                  to="/admin/users"
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/reports"
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Reports
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Recent Tasks
              </h2>
              <div className="space-y-4">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {task.status}
                        </div>
                      </div>
                      <Link
                        to={`/admin/tasks/${task._id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tasks yet
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
