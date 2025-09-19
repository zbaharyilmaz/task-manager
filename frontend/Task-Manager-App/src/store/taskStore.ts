import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { TaskState, Task } from "../types";

export const useTaskStore = create<TaskState>()((set, get) => ({
  // State
  tasks: [],
  loading: false,
  error: null,

  // Actions
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        set({ tasks: data.data.tasks, loading: false });
        return { success: true, tasks: data.data.tasks };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
    } catch (error) {
      set({ error: "Failed to fetch tasks! 😢", loading: false });
      return { success: false, error: "Failed to fetch tasks! 😢" };
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        const newTask = data.data.task;
        set((state) => ({
          tasks: [...state.tasks, newTask],
          loading: false,
        }));
        return { success: true, task: newTask };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
    } catch (error) {
      set({ error: "Failed to create task! 😢", loading: false });
      return { success: false, error: "Failed to create task! 😢" };
    }
  },

  updateTask: async (taskId, taskData) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        }
      );

      const data = await response.json();

      if (data.success) {
        const updatedTask = data.data.task;
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === taskId ? updatedTask : task
          ),
          loading: false,
        }));
        return { success: true, task: updatedTask };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
    } catch (error) {
      set({ error: "Failed to update task! 😢", loading: false });
      return { success: false, error: "Failed to update task! 😢" };
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const updatedTask = data.data.task;
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === taskId ? updatedTask : task
          ),
          loading: false,
        }));
        return { success: true, task: updatedTask };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
    } catch (error) {
      set({ error: "Failed to update task status! 😢", loading: false });
      return { success: false, error: "Failed to update task status! 😢" };
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== taskId),
          loading: false,
        }));
        return { success: true };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
    } catch (error) {
      set({ error: "Failed to delete task! 😢", loading: false });
      return { success: false, error: "Failed to delete task! 😢" };
    }
  },

  getTaskById: (taskId) => {
    const { tasks } = get();
    return tasks.find((task) => task._id === taskId);
  },

  getTasksByStatus: (status) => {
    const { tasks } = get();
    return tasks.filter((task) => task.status === status);
  },

  getTasksByUser: (userId) => {
    const { tasks } = get();
    return tasks.filter((task) => task.assignedTo === userId);
  },

  // Computed values
  getStats: () => {
    const { tasks } = get();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "done"
    ).length;
    const pendingTasks = tasks.filter((task) => task.status !== "done").length;
    const overdueTasks = tasks.filter(
      (task) => new Date(task.dueDate) < new Date() && task.status !== "done"
    ).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    };
  },
}));
