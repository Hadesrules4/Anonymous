import React from "react";
import connectDB from "@/lib/db";
import Feedback from "@/models/Feedback";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FeedbackList } from "@/components/dashboard/FeedbackList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback Inbox | UNSAID",
};

export default async function FeedbackInboxPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();

  const feedbacks = await Feedback.find({
    recipientId: session.user.id,
    isDeleted: false,
  })
    .populate("requestId", "title")
    .sort({ createdAt: -1 })
    .lean();

  const serializedFeedbacks = feedbacks.map((f: any) => ({
    _id: f._id.toString(),
    message: f.message,
    category: f.category,
    isRead: f.isRead,
    createdAt: f.createdAt.toISOString(),
    requestId: f.requestId ? { title: f.requestId.title } : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Feedback Inbox
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review all anonymous feedback submitted to your profile and requests
        </p>
      </div>

      <FeedbackList initialFeedbacks={serializedFeedbacks} />
    </div>
  );
}
