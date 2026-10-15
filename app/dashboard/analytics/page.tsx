import React from "react";
import connectDB from "@/lib/db";
import Feedback from "@/models/Feedback";
import FeedbackRequest from "@/models/FeedbackRequest";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import mongoose from "mongoose";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback Analytics | UNSAID",
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.user.id);

  const totalFeedback = await Feedback.countDocuments({
    recipientId: userId,
    isDeleted: false,
  });

  const totalRequests = await FeedbackRequest.countDocuments({
    ownerId: userId,
  });

  const unreadFeedback = await Feedback.countDocuments({
    recipientId: userId,
    isRead: false,
    isDeleted: false,
  });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekFeedback = await Feedback.countDocuments({
    recipientId: userId,
    isDeleted: false,
    createdAt: { $gte: oneWeekAgo },
  });

  // Categories aggregation
  const categoryAgg = await Feedback.aggregate([
    { $match: { recipientId: userId, isDeleted: false } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const categoryStats = categoryAgg.map((c) => ({
    category: c._id || "General",
    count: c.count,
  }));

  // Daily submissions trend
  const dailyStats = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    const count = await Feedback.countDocuments({
      recipientId: userId,
      isDeleted: false,
      createdAt: { $gte: start, $lte: end },
    });

    dailyStats.push({
      day: start.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Feedback Analytics
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Visual insights into response volumes, weekly trends, and topic distribution
        </p>
      </div>

      <AnalyticsCharts
        stats={{
          totalFeedback,
          totalRequests,
          unreadFeedback,
          thisWeekFeedback,
        }}
        categoryStats={categoryStats}
        dailyStats={dailyStats}
      />
    </div>
  );
}
