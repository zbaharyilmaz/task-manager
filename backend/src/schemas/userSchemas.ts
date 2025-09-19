import { z } from "zod";

// User schemas
export const updateUserRoleSchema = z.object({
  role: z.enum(["admin", "user"]),
});

export const getUserByIdSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export const deleteUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

// Type exports
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
