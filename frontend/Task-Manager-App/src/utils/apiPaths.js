const API_BASE_URL = "http://localhost:8000/api";

export const API_PATHS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,

  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  UPDATE_USER_ROLE: (id) => `${API_BASE_URL}/users/${id}/role`,

  // Tasks
  TASKS: `${API_BASE_URL}/tasks`,
  TASK_BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
  UPDATE_TASK_STATUS: (id) => `${API_BASE_URL}/tasks/${id}/status`,

  // Reports
  REPORTS: `${API_BASE_URL}/reports`,
};
