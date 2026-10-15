import { z } from "zod";

export const updateProfileSchema = z.object({
  isAcceptingFeedback: z.boolean(),
  profileImage: z.string().url().or(z.literal("")).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
