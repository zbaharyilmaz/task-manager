import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";

const ViewTaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getTaskById, updateTaskStatus } = useTaskStore();

  const task = id ? getTaskById(id) : null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully! 👋");
    navigate("/login");
  };

  const handleStatusChange = async (
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    if (!id) return;

    const result = await updateTaskStatus(id, newStatus);
    if (result.success) {
      toast.success("Task status updated! ✨");
    } else {
      toast.error(result.error || "Failed to update status! 😢");
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center relative overflow-hidden">
        <div className="relative p-8 bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-white mb-4">Task Not Found</h1>
          <p className="text-white/70 text-lg mb-6">
            The task you're looking for doesn't exist.
          </p>
          <Link
            to="/user/my-tasks"
            className="inline-block bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-md"
          >
            Back to My Tasks
          </Link>
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

      <div className="relative z-10 max-w-4xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 p-6 bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Task Details</h1>
            <p className="text-white/80 text-lg">View task information</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/user/my-tasks"
              className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-md"
            >
              Back to Tasks
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-md"
            >
              Logout 🚪
            </button>
          </div>
        </header>

        {/* Task Details */}
        <div className="bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {task.title}
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  {task.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-2">Priority</p>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      task.priority === "high"
                        ? "bg-red-500/80 text-white"
                        : task.priority === "medium"
                        ? "bg-yellow-500/80 text-white"
                        : "bg-green-500/80 text-white"
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-2">Status</p>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(
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
              </div>

              <div>
                <p className="text-white/60 text-sm mb-2">Due Date</p>
                <p className="text-white text-lg font-medium">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-2">Assigned To</p>
                <p className="text-white text-lg font-medium">
                  {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
            </div>

            {/* Right Column - Checklist */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Checklist ✅
              </h3>
              {task.checklist && task.checklist.length > 0 ? (
                <div className="space-y-3">
                  {task.checklist.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-lg ${
                        item.completed
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                          item.completed
                            ? "bg-green-500 text-white"
                            : "bg-white/20 border border-white/40"
                        }`}
                      >
                        {item.completed && "✓"}
                      </div>
                      <span
                        className={`text-white ${
                          item.completed ? "line-through opacity-70" : ""
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-lg">
                  No checklist items for this task.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskDetails;
