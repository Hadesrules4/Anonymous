"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

interface AnalyticsChartsProps {
  stats: {
    totalFeedback: number;
    totalRequests: number;
    unreadFeedback: number;
    thisWeekFeedback: number;
  };
  categoryStats: { category: string; count: number }[];
  dailyStats: { day: string; count: number }[];
}

export function AnalyticsCharts({
  stats,
  categoryStats,
  dailyStats,
}: AnalyticsChartsProps) {
  return (
    <div className="space-y-8">
      {/* Overview Metric Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase text-zinc-500">Total Feedback</p>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">{stats.totalFeedback}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase text-zinc-500">This Week</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.thisWeekFeedback}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase text-zinc-500">Unread</p>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{stats.unreadFeedback}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase text-zinc-500">Active Requests</p>
          <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{stats.totalRequests}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Breakdown Bar Chart */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Feedback by Category
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Distribution across career, portfolio, personality, and work topics
          </p>

          {categoryStats.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-zinc-400">
              No category data yet
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 7-Day Activity Area Chart */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Activity Trend (Last 7 Days)
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Daily anonymous feedback submissions received
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
