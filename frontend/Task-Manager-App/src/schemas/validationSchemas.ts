import * as yup from "yup";

// Auth schemas
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

// Task schemas
export const createTaskSchema = yup.object({
  title: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high"], "Please select a valid priority")
    .required("Priority is required"),
  dueDate: yup
    .date()
    .min(new Date(), "Due date must be in the future")
    .required("Due date is required"),
  assignedTo: yup.string().required("Please assign to a user"),
  status: yup
    .string()
    .oneOf(["todo", "in-progress", "done"], "Please select a valid status")
    .default("todo"),
  checklist: yup
    .array()
    .of(
      yup.object({
        text: yup.string().required("Checklist item text is required"),
        completed: yup.boolean().default(false),
      })
    )
    .default([]),
});

export const updateTaskSchema = yup.object({
  title: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high"], "Please select a valid priority"),
  dueDate: yup.date().min(new Date(), "Due date must be in the future"),
  assignedTo: yup.string(),
  status: yup
    .string()
    .oneOf(["todo", "in-progress", "done"], "Please select a valid status"),
  checklist: yup.array().of(
    yup.object({
      text: yup.string().required("Checklist item text is required"),
      completed: yup.boolean().default(false),
    })
  ),
});

// User schemas
export const updateUserRoleSchema = yup.object({
  role: yup
    .string()
    .oneOf(["admin", "user"], "Please select a valid role")
    .required("Role is required"),
});

export const updateProfileSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .optional(),
});
