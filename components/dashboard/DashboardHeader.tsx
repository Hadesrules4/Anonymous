"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Link2, Check, ExternalLink } from "lucide-react";
import { CreateRequestModal } from "./CreateRequestModal";

interface DashboardHeaderProps {
  username: string;
  isAcceptingFeedback: boolean;
}

export function DashboardHeader({
  username,
  isAcceptingFeedback,
}: DashboardHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/feedback/${username}`
    : `/feedback/${username}`;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Welcome back, {username} 👋
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
          Status:{" "}
          <span
            className={`inline-flex items-center gap-1.5 font-medium ${
              isAcceptingFeedback
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isAcceptingFeedback ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            {isAcceptingFeedback ? "Accepting Feedback" : "Feedback Paused"}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onClick={copyProfileLink}
          className="gap-2 text-sm rounded-xl"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Copied Link</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              <span>Copy General Link</span>
            </>
          )}
        </Button>

        <a
          href={`/feedback/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 px-3 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          title="Open your public page"
        >
          <ExternalLink className="h-4 w-4" />
        </a>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span>New Feedback Request</span>
        </Button>
      </div>

      {isModalOpen && (
        <CreateRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
