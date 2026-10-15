import React from "react";
import { MessageSquare, GitPullRequest, EyeOff, Calendar } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalFeedback: number;
    totalRequests: number;
    unreadFeedback: number;
    thisWeekFeedback: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Feedback Received",
      value: stats.totalFeedback,
      icon: MessageSquare,
      description: "Total honest responses received",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      label: "Active Requests",
      value: stats.totalRequests,
      icon: GitPullRequest,
      description: "Specific feedback topics created",
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40",
    },
    {
      label: "Unread Feedback",
      value: stats.unreadFeedback,
      icon: EyeOff,
      description: "Awaiting your review",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "This Week",
      value: stats.thisWeekFeedback,
      icon: Calendar,
      description: "Received in the last 7 days",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {c.label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {c.value}
              </span>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {c.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
