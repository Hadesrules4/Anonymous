"use client";

import React, { useState } from "react";
import { FeedbackCard } from "./FeedbackCard";
import { Input } from "@/components/ui/input";
import { Search, Inbox, Filter } from "lucide-react";

interface FeedbackListProps {
  initialFeedbacks: any[];
}

export function FeedbackList({ initialFeedbacks }: FeedbackListProps) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "all",
    ...Array.from(new Set(feedbacks.map((f) => f.category || "General"))),
  ];

  const filteredFeedbacks = feedbacks.filter((item) => {
    if (filter === "unread" && item.isRead) return false;
    if (filter === "read" && !item.isRead) return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !item.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search feedback contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer ${
                filter === "all"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
              }`}
            >
              All ({feedbacks.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer ${
                filter === "unread"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
              }`}
            >
              Unread ({feedbacks.filter((f) => !f.isRead).length})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer ${
                filter === "read"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
              }`}
            >
              Read
            </button>
          </div>

          {categories.length > 2 && (
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-8 rounded-lg border border-zinc-200 bg-transparent px-2 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
          <Inbox className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600 mb-3" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            No feedback found
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            {feedbacks.length === 0
              ? "Share your link to receive your first anonymous feedback."
              : "No feedback matches the selected filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredFeedbacks.map((fb) => (
            <FeedbackCard key={fb._id} feedback={fb} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
