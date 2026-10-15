"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  submitFeedbackSchema,
  type SubmitFeedbackInput,
} from "@/lib/validations/feedback";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AISuggestions } from "./AISuggestions";
import { AnonymousBadge } from "./AnonymousBadge";
import { toast } from "sonner";
import {
  Send,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface FeedbackFormProps {
  recipientUsername: string;
  request?: {
    _id: string;
    title: string;
    question: string;
    category: string;
    slug: string;
  } | null;
}

export function FeedbackForm({
  recipientUsername,
  request,
}: FeedbackFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubmitFeedbackInput>({
    resolver: zodResolver(submitFeedbackSchema),
    defaultValues: {
      recipientUsername,
      requestSlug: request?.slug,
      message: "",
      category: request?.category || "General",
    },
  });

  const messageText = watch("message");

  const onSubmit = async (data: SubmitFeedbackInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (!res.success) {
        const errMsg = res.error || "Failed to submit feedback.";
        setErrorMessage(errMsg);
        toast.error(errMsg);
        return;
      }

      // Show popup toast message
      toast.success("Feedback sent anonymously! 🎉", {
        description: `Your honest thoughts have been safely delivered to @${recipientUsername}.`,
      });

      setIsSubmitted(true);
      reset();
    } catch (err: any) {
      const errMsg = err.message || "An error occurred while submitting.";
      setErrorMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const current = messageText ? `${messageText}\n\n` : "";
    setValue("message", `${current}${suggestion}`, { shouldValidate: true });
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Feedback Submitted Anonymously!
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Thank you for providing honest, constructive input to{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {recipientUsername}
          </span>
          . No personal data, IP, or account ID was associated with this response.
        </p>

        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            className="rounded-xl"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Target prompt card */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {recipientUsername} wants feedback
            </span>
            <Badge variant="secondary">
              {request?.category || "General Perspective"}
            </Badge>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {request?.title || `Send feedback to @${recipientUsername}`}
          </h1>

          {request?.question && (
            <div className="rounded-2xl bg-zinc-50 p-4 italic text-sm text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800">
              &ldquo;{request.question}&rdquo;
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
          className="mt-5 space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Your Feedback
              </label>
              <span className="text-xs text-zinc-400">
                {(messageText || "").length} / 1500
              </span>
            </div>

            <Textarea
              {...register("message")}
              placeholder="Write your honest, candid, and constructive feedback here. Be truthful — your identity will NOT be revealed..."
              className="min-h-[140px] text-base"
              disabled={isLoading}
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* AI Suggestions Box */}
          <AISuggestions
            title={request?.title}
            question={request?.question}
            category={request?.category}
            onSelectSuggestion={handleSelectSuggestion}
          />

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 rounded-2xl h-12 text-base font-semibold shadow-md active:scale-[0.99]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Anonymously...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Anonymously
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Your identity won&apos;t be shown &bull; No login required</span>
          </div>
        </form>
      </div>

      <AnonymousBadge />
    </div>
  );
}
