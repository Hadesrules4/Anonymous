import { z } from "zod";

export const createFeedbackRequestSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(300, "Question prompt cannot exceed 300 characters"),
  category: z.enum([
    "General",
    "Career",
    "Portfolio",
    "Personality",
    "Communication",
    "Work/Projects",
    "Other",
  ]),
});

export const submitFeedbackSchema = z.object({
  recipientUsername: z.string().min(1, "Recipient username is required"),
  requestSlug: z.string().optional(),
  message: z
    .string()
    .min(10, "Feedback message must be at least 10 characters")
    .max(1500, "Feedback message cannot exceed 1500 characters"),
  category: z.string(),
});

export type CreateFeedbackRequestInput = z.infer<typeof createFeedbackRequestSchema>;
export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
