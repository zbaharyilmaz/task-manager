import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "../../store/taskStore";
import { useUserStore } from "../../store/userStore";
import { createTaskSchema } from "../../schemas/validationSchemas";
import toast from "react-hot-toast";

const CreateTask = () => {
  const navigate = useNavigate();
  const { createTask } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
      status: "todo",
      checklist: [{ text: "", completed: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "checklist",
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Filter out empty checklist items
    const filteredChecklist = data.checklist.filter(
      (item) => item.text.trim() !== ""
    );

    const taskData = {
      ...data,
      checklist: filteredChecklist,
    };

    const result = await createTask(taskData);

    if (result.success) {
      toast.success("Task created successfully! 🎉");
      reset();
      navigate("/admin/dashboard");
    } else {
      toast.error(result.error || "Failed to create task! 😢");
    }

    setIsSubmitting(false);
  };

  const addChecklistItem = () => {
    append({ text: "", completed: false });
  };

  const removeChecklistItem = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

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
              <h1 className="text-4xl font-bold text-white mb-2">
                Create Task
              </h1>
              <p className="text-white/80 text-lg">
                Add a new task to the system
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-3 bg-gray-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-gray-600/80 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Task Title *
              </label>
              <input
                {...register("title")}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Priority and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Priority *
                </label>
                <select
                  {...register("priority")}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="low" className="bg-gray-800">
                    Low
                  </option>
                  <option value="medium" className="bg-gray-800">
                    Medium
                  </option>
                  <option value="high" className="bg-gray-800">
                    High
                  </option>
                </select>
                {errors.priority && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.priority.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  {...register("dueDate")}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {errors.dueDate && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Assign To *
              </label>
              <select
                {...register("assignedTo")}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="bg-gray-800">
                  Select a user
                </option>
                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                    className="bg-gray-800"
                  >
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.assignedTo.message}
                </p>
              )}
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-white">
                  Checklist
                </label>
                <button
                  type="button"
                  onClick={addChecklistItem}
                  className="px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600/80 transition-colors text-sm font-medium"
                >
                  Add Item +
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-3">
                    <input
                      {...register(`checklist.${index}.text`)}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter checklist item"
                    />
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(index)}
                      disabled={fields.length === 1}
                      className="px-3 py-3 bg-red-500/80 text-white rounded-lg hover:bg-red-600/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-8 py-4 bg-gray-500/80 text-white rounded-xl hover:bg-gray-600/80 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-medium"
              >
                {isSubmitting ? "Creating Task..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
