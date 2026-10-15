"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  Check,
  Power,
  Trash2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import {
  toggleFeedbackRequestAction,
  deleteFeedbackRequestAction,
} from "@/actions/feedback";

interface RequestItem {
  _id: string;
  title: string;
  question: string;
  category: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  feedbackCount?: number;
}

interface RequestsListProps {
  username: string;
  requests: RequestItem[];
}

export function RequestsList({ username, requests }: RequestsListProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [items, setItems] = useState<RequestItem[]>(requests);

  const copyLink = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/feedback/${username}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleToggle = async (id: string) => {
    const res = await toggleFeedbackRequestAction(id);
    if (res.success) {
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: res.isActive ?? !item.isActive } : item
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback request?")) return;
    const res = await deleteFeedbackRequestAction(id);
    if (res.success) {
      setItems((prev) => prev.filter((item) => item._id !== id));
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
        <MessageSquare className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          No feedback requests created yet
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Create a targeted request like &ldquo;Placement Preparation&rdquo; or &ldquo;Portfolio Review&rdquo; to share with peers.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((req) => {
        const isCopied = copiedSlug === req.slug;

        return (
          <div
            key={req._id}
            className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-zinc-900/60 ${
              req.isActive
                ? "border-zinc-200/90 dark:border-zinc-800"
                : "border-zinc-200/40 opacity-75 dark:border-zinc-800/40"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">
                      {req.title}
                    </h3>
                    <Badge variant={req.isActive ? "default" : "secondary"}>
                      {req.category}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    /feedback/{username}/{req.slug}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggle(req._id)}
                    title={req.isActive ? "Deactivate link" : "Activate link"}
                    className={`rounded-lg p-1.5 transition ${
                      req.isActive
                        ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(req._id)}
                    title="Delete request"
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-zinc-50 p-3.5 italic text-sm text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                &ldquo;{req.question}&rdquo;
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyLink(req.slug)}
                  className="gap-1.5 text-xs h-8 rounded-lg"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="h-3.5 w-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </Button>

                <a
                  href={`/feedback/${username}/${req.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  title="Preview anonymous page"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <Link
                href={`/dashboard/feedback?request=${req._id}`}
                className="text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
              >
                View Feedback &rarr;
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
