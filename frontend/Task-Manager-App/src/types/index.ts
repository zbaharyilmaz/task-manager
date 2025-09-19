// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface ChecklistItem {
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  dueDate: string;
  assignedTo?: User;
  createdBy: User;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Store types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: Omit<RegisterData, "confirmPassword">
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (
    profileData: Partial<RegisterData>
  ) => Promise<{ success: boolean; error?: string }>;
  initialize: () => void;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<{
    success: boolean;
    data?: Task[];
    error?: string;
  }>;
  createTask: (
    taskData: Omit<
      Task,
      "id" | "createdAt" | "updatedAt" | "createdBy" | "assignedTo"
    >
  ) => Promise<{ success: boolean; data?: Task; error?: string }>;
  updateTask: (
    taskId: string,
    taskData: Partial<Task>
  ) => Promise<{ success: boolean; data?: Task; error?: string }>;
  updateTaskStatus: (
    taskId: string,
    status: Task["status"]
  ) => Promise<{ success: boolean; data?: Task; error?: string }>;
  deleteTask: (taskId: string) => Promise<{ success: boolean; error?: string }>;
  getTaskById: (taskId: string) => Task | undefined;
  getTasksByStatus: (status: Task["status"]) => Task[];
  getTasksByUser: (userId: string) => Task[];
  getTaskStats: () => {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<{
    success: boolean;
    data?: User[];
    error?: string;
  }>;
  updateUserRole: (
    userId: string,
    role: User["role"]
  ) => Promise<{ success: boolean; data?: User; error?: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  getUserById: (userId: string) => User | undefined;
  getUsersByRole: (role: User["role"]) => User[];
  getUserStats: () => {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
  };
}
