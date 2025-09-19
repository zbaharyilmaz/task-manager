import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { UserState, User } from "../types";

export const useUserStore = create<UserState>()((set, get) => ({
  // State
  users: [],
  loading: false,
  error: null,

  // Actions
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        set({ users: data.data.users, loading: false });
        return { success: true, users: data.data.users };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
    } catch (error) {
      set({ error: "Failed to fetch users! 😢", loading: false });
      return { success: false, error: "Failed to fetch users! 😢" };
    }
  },

  updateUserRole: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const updatedUser = data.data.user;
        set((state) => ({
          users: state.users.map((user) =>
            user._id === userId ? updatedUser : user
          ),
          loading: false,
        }));
        return { success: true, user: updatedUser };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
    } catch (error) {
      set({ error: "Failed to update user role! 😢", loading: false });
      return { success: false, error: "Failed to update user role! 😢" };
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
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
          users: state.users.filter((user) => user._id !== userId),
          loading: false,
        }));
        return { success: true };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
    } catch (error) {
      set({ error: "Failed to delete user! 😢", loading: false });
      return { success: false, error: "Failed to delete user! 😢" };
    }
  },

  getUserById: (userId) => {
    const { users } = get();
    return users.find((user) => user._id === userId);
  },

  getUsersByRole: (role) => {
    const { users } = get();
    return users.filter((user) => user.role === role);
  },

  // Computed values
  getStats: () => {
    const { users } = get();
    const totalUsers = users.length;
    const adminUsers = users.filter((user) => user.role === "admin").length;
    const regularUsers = users.filter((user) => user.role === "user").length;

    return {
      totalUsers,
      adminUsers,
      regularUsers,
    };
  },
}));
