import { z } from "zod";

// Task schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().datetime("Please enter a valid date"),
  assignedTo: z.string().min(1, "Please assign to a user"),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  checklist: z
    .array(
      z.object({
        text: z.string().min(1, "Checklist item text is required"),
        completed: z.boolean().default(false),
      })
    )
    .default([]),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().datetime("Please enter a valid date").optional(),
  assignedTo: z.string().min(1, "Please assign to a user").optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  checklist: z
    .array(
      z.object({
        text: z.string().min(1, "Checklist item text is required"),
        completed: z.boolean().default(false),
      })
    )
    .optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["todo", "in-progress", "done"]),
});

// Type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
