import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: [],
    todoCheckList: [{ text: "", completed: false }],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users! 😢");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChecklistChange = (index, field, value) => {
    const newChecklist = [...formData.todoCheckList];
    newChecklist[index] = {
      ...newChecklist[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      todoCheckList: newChecklist,
    });
  };

  const addChecklistItem = () => {
    setFormData({
      ...formData,
      todoCheckList: [
        ...formData.todoCheckList,
        { text: "", completed: false },
      ],
    });
  };

  const removeChecklistItem = (index) => {
    const newChecklist = formData.todoCheckList.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      todoCheckList: newChecklist,
    });
  };

  const handleUserSelection = (userId, isSelected) => {
    if (isSelected) {
      setFormData({
        ...formData,
        assignedTo: [...formData.assignedTo, userId],
      });
    } else {
      setFormData({
        ...formData,
        assignedTo: formData.assignedTo.filter((id) => id !== userId),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty checklist items
      const filteredChecklist = formData.todoCheckList.filter(
        (item) => item.text.trim() !== ""
      );

      const taskData = {
        ...formData,
        todoCheckList: filteredChecklist,
      };

      await axiosInstance.post("/tasks", taskData);
      toast.success("Task created successfully! 🎯");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task! 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Task ➕
              </h1>
              <p className="text-sm text-gray-600">
                Add a new task to the system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information 📝
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    required
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* User Assignment */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Assign Users 👥
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(user._id)}
                    onChange={(e) =>
                      handleUserSelection(user._id, e.target.checked)
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Task Checklist ✅
              </h2>
              <button
                type="button"
                onClick={addChecklistItem}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm transition duration-200"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.todoCheckList.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleChecklistChange(index, "text", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter checklist item"
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating... ⏳" : "Create Task 🎯"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
