import React from "react";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import FeedbackRequest from "@/models/FeedbackRequest";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RequestsList } from "@/components/dashboard/RequestsList";
import { FeedbackCard } from "@/components/dashboard/FeedbackCard";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview | UNSAID",
};

export default async function DashboardOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById(session.user.id).select(
    "username email isAcceptingFeedback"
  );

  if (!user) {
    redirect("/login");
  }

  const requests = await FeedbackRequest.find({
    ownerId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .lean();

  const totalFeedback = await Feedback.countDocuments({
    recipientId: session.user.id,
    isDeleted: false,
  });

  const unreadFeedback = await Feedback.countDocuments({
    recipientId: session.user.id,
    isRead: false,
    isDeleted: false,
  });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekFeedback = await Feedback.countDocuments({
    recipientId: session.user.id,
    isDeleted: false,
    createdAt: { $gte: oneWeekAgo },
  });

  const recentFeedbacks = await Feedback.find({
    recipientId: session.user.id,
    isDeleted: false,
  })
    .populate("requestId", "title")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const serializedRequests = requests.map((r) => ({
    _id: r._id.toString(),
    title: r.title,
    question: r.question,
    category: r.category,
    slug: r.slug,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
  }));

  const serializedFeedbacks = recentFeedbacks.map((f: any) => ({
    _id: f._id.toString(),
    message: f.message,
    category: f.category,
    isRead: f.isRead,
    createdAt: f.createdAt.toISOString(),
    requestId: f.requestId ? { title: f.requestId.title } : null,
  }));

  return (
    <div className="space-y-8">
      <DashboardHeader
        username={user.username}
        isAcceptingFeedback={user.isAcceptingFeedback}
      />

      <StatsCards
        stats={{
          totalFeedback,
          totalRequests: requests.length,
          unreadFeedback,
          thisWeekFeedback,
        }}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Your Feedback Requests
          </h2>
          <span className="text-xs text-zinc-500">
            {requests.length} active topics
          </span>
        </div>
        <RequestsList
          username={user.username}
          requests={serializedRequests}
        />
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Recent Feedback
          </h2>
          <Link
            href="/dashboard/feedback"
            className="text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
          >
            View All ({totalFeedback}) &rarr;
          </Link>
        </div>

        {serializedFeedbacks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
            No feedback received yet. Share one of your request links above to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {serializedFeedbacks.map((item) => (
              <FeedbackCard key={item._id} feedback={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
