import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, LoginCredentials, RegisterData, User } from "../types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ loading: true });
        try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (data.success) {
            const { user, token } = data.data;
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false,
            });
            return { success: true, data: data.data };
          } else {
            set({ loading: false });
            return { success: false, error: data.message };
          }
        } catch (error) {
          set({ loading: false });
          return { success: false, error: "Login failed! 😢" };
        }
      },

      register: async (userData: Omit<RegisterData, "confirmPassword">) => {
        set({ loading: true });
        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );

          const data = await response.json();

          if (data.success) {
            const { user, token } = data.data;
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false,
            });
            return { success: true, data: data.data };
          } else {
            set({ loading: false });
            return { success: false, error: data.message };
          }
        } catch (error) {
          set({ loading: false });
          return { success: false, error: "Registration failed! 😢" };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      updateProfile: async (profileData: Partial<RegisterData>) => {
        set({ loading: true });
        try {
          const { token } = get();
          const response = await fetch(
            "http://localhost:5000/api/auth/profile",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(profileData),
            }
          );

          const data = await response.json();

          if (data.success) {
            set({
              user: { ...get().user, ...data.data },
              loading: false,
            });
            return { success: true, data: data.data };
          } else {
            set({ loading: false });
            return { success: false, error: data.message };
          }
        } catch (error) {
          set({ loading: false });
          return { success: false, error: "Profile update failed! 😢" };
        }
      },

      // Initialize from localStorage
      initialize: () => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          set({
            user: JSON.parse(storedUser),
            token: storedToken,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
