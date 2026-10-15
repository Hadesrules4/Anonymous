"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { UserX, Trash2, CheckCircle2, Clock } from "lucide-react";
import { markFeedbackReadAction, deleteFeedbackAction } from "@/actions/feedback";

interface FeedbackItemProps {
  feedback: {
    _id: string;
    message: string;
    category: string;
    isRead: boolean;
    createdAt: string | Date;
    requestId?: {
      title?: string;
    } | null;
  };
  onDelete?: (id: string) => void;
}

export function FeedbackCard({ feedback, onDelete }: FeedbackItemProps) {
  const [isRead, setIsRead] = useState(feedback.isRead);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(feedback.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleMarkRead = async () => {
    if (isRead) return;
    setIsRead(true);
    await markFeedbackReadAction(feedback._id);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    setIsDeleting(true);
    const res = await deleteFeedbackAction(feedback._id);
    if (res.success && onDelete) {
      onDelete(feedback._id);
    }
  };

  return (
    <div
      onClick={handleMarkRead}
      className={`group relative rounded-2xl border p-5 transition-all ${
        isRead
          ? "border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/40"
          : "border-blue-200 bg-blue-50/20 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          {!isRead && (
            <span
              className="h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950 shrink-0"
              title="New unread feedback"
            />
          )}
          <Badge variant="secondary" className="font-medium text-xs">
            {feedback.category}
          </Badge>
          {feedback.requestId?.title && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              for <span className="font-medium text-zinc-700 dark:text-zinc-300">{feedback.requestId.title}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Clock className="h-3 w-3" />
            {formattedDate}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className="rounded-lg p-1 text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-opacity cursor-pointer"
            title="Delete feedback"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3.5 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">
        &ldquo;{feedback.message}&rdquo;
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <UserX className="h-3.5 w-3.5 text-zinc-400" />
          <span>Sender: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">UNKNOWN (Anonymous)</span></span>
        </div>

        {isRead ? (
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400" />
            Read
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkRead();
            }}
            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}
