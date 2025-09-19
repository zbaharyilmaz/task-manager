import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks");
      setTasks(response.data.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks! 😢");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
      });
      toast.success("Task status updated! ✨");
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status! 😢");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "todo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks... ⏳</p>
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
              <h1 className="text-2xl font-bold text-gray-900">My Tasks 📝</h1>
              <p className="text-sm text-gray-600">
                Manage your assigned tasks
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/user/dashboard"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: "all", label: "All Tasks", icon: "📋" },
              { key: "todo", label: "To Do", icon: "⏳" },
              { key: "in-progress", label: "In Progress", icon: "🔄" },
              { key: "done", label: "Done", icon: "✅" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  filter === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority} priority
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{task.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span>👤 Created by: {task.createdBy?.name}</span>
                      {task.assignedTo?.length > 0 && (
                        <span>
                          👥 Assigned to:{" "}
                          {task.assignedTo.map((user) => user.name).join(", ")}
                        </span>
                      )}
                    </div>

                    {/* Todo Checklist */}
                    {task.todoCheckList && task.todoCheckList.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Checklist:
                        </p>
                        <div className="space-y-1">
                          {task.todoCheckList.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span
                                className={
                                  item.completed
                                    ? "text-green-500"
                                    : "text-gray-400"
                                }
                              >
                                {item.completed ? "✅" : "⭕"}
                              </span>
                              <span
                                className={
                                  item.completed
                                    ? "line-through text-gray-500"
                                    : "text-gray-700"
                                }
                              >
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {task.status !== "done" && (
                      <button
                        onClick={() => updateTaskStatus(task._id, "done")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        Mark Complete ✅
                      </button>
                    )}
                    {task.status === "todo" && (
                      <button
                        onClick={() =>
                          updateTaskStatus(task._id, "in-progress")
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        Start Task 🚀
                      </button>
                    )}
                    <Link
                      to={`/user/task-details/${task._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm text-center transition duration-200"
                    >
                      View Details 👁️
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tasks found! 🎯
              </h3>
              <p className="text-gray-500">
                {filter === "all"
                  ? "You don't have any tasks assigned yet."
                  : `No tasks with status "${filter}" found.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
