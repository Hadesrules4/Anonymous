"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFeedbackRequestSchema,
  type CreateFeedbackRequestInput,
} from "@/lib/validations/feedback";
import { createFeedbackRequestAction } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, Sparkles, Check } from "lucide-react";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "General",
  "Career",
  "Portfolio",
  "Personality",
  "Communication",
  "Work/Projects",
  "Other",
] as const;

export function CreateRequestModal({ isOpen, onClose }: CreateRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateFeedbackRequestInput>({
    resolver: zodResolver(createFeedbackRequestSchema),
    defaultValues: {
      title: "",
      question: "",
      category: "Career",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CreateFeedbackRequestInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await createFeedbackRequestAction(data);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to create request");
        return;
      }

      setCreatedSlug(res.request?.slug || "created");
      setTimeout(() => {
        reset();
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplate = (title: string, question: string, category: any) => {
    setValue("title", title);
    setValue("question", question);
    setValue("category", category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Contextual Feedback
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Create a Feedback Request
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Instead of generic feedback, ask specific questions to get truly actionable advice.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {createdSlug && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Check className="h-4 w-4" />
            Feedback request created successfully!
          </div>
        )}

        {/* Quick templates */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="text-xs font-semibold text-zinc-400 py-1 mr-1">
            Try:
          </span>
          <button
            type="button"
            onClick={() =>
              handleTemplate(
                "Placement Preparation",
                "What should I improve before technical interviews?",
                "Career"
              )
            }
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300"
          >
            Placement Prep
          </button>
          <button
            type="button"
            onClick={() =>
              handleTemplate(
                "Portfolio Review",
                "What can I improve in my portfolio UI/UX and project descriptions?",
                "Portfolio"
              )
            }
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300"
          >
            Portfolio
          </button>
          <button
            type="button"
            onClick={() =>
              handleTemplate(
                "Communication & Teamwork",
                "How can I communicate my technical ideas more clearly in meetings?",
                "Communication"
              )
            }
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300"
          >
            Communication
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Title
            </label>
            <Input
              {...register("title")}
              placeholder="e.g. Placement Preparation"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Specific Prompt / Question
            </label>
            <Textarea
              {...register("question")}
              placeholder="e.g. What should I improve before upcoming technical and HR rounds?"
              className="min-h-[90px]"
              disabled={isLoading}
            />
            {errors.question && (
              <p className="text-xs text-red-500">{errors.question.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Category
            </label>
            <select
              {...register("category")}
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900"
              disabled={isLoading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Link...
                </>
              ) : (
                "Create & Generate Link"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
