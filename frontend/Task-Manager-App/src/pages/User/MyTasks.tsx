import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";

const MyTasks = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { tasks, fetchTasks, updateTaskStatus } = useTaskStore();
  const loading = useTaskStore((state) => state.loading);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully! 👋");
    navigate("/login");
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

  // Filter tasks assigned to current user
  const myTasks = tasks.filter((task) => task.assignedTo?.id === user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center relative overflow-hidden">
        <div className="relative p-8 bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">
            Loading your tasks... ⏳
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden p-8">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 p-6 bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
            <p className="text-white/80 text-lg">Tasks assigned to you</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/user/dashboard"
              className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-md"
            >
              Dashboard 📊
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-md"
            >
              Logout 🚪
            </button>
          </div>
        </header>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTasks.length > 0 ? (
            myTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{task.title}</h3>
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
                </div>

                <p className="text-white/70 mb-4 line-clamp-3">
                  {task.description}
                </p>

                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2">Due Date:</p>
                  <p className="text-white font-medium">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2">Status:</p>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(
                        task.id,
                        e.target.value as "todo" | "in-progress" | "done"
                      )
                    }
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/user/task-details/${task.id}`}
                    className="flex-1 bg-blue-500/80 hover:bg-blue-600/80 text-white px-4 py-2 rounded text-center text-sm transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-white/70 text-xl">
              <p className="mb-2">No tasks assigned yet! 🎯</p>
              <p className="text-white/50 text-lg">
                Check back later or contact your admin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
