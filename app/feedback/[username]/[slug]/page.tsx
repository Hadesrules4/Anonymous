import React from "react";
import connectDB from "@/lib/db";
import User from "@/models/User";
import FeedbackRequest from "@/models/FeedbackRequest";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  await connectDB();
  const request = await FeedbackRequest.findOne({ slug: slug.toLowerCase() });

  return {
    title: request
      ? `${request.title} — Anonymous Feedback for @${username} | UNSAID`
      : `Feedback for @${username} | UNSAID`,
    description: request?.question || "Leave honest, anonymous feedback.",
  };
}

export default async function ContextualFeedbackPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  await connectDB();
  const recipient = await User.findOne({
    username: username.toLowerCase().trim(),
  }).select("_id username isAcceptingFeedback");

  if (!recipient) {
    notFound();
  }

  const feedbackRequest = await FeedbackRequest.findOne({
    ownerId: recipient._id,
    slug: slug.toLowerCase().trim(),
  }).lean();

  if (!feedbackRequest) {
    notFound();
  }

  if (!recipient.isAcceptingFeedback) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Feedback Paused
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            @{username} has currently paused accepting anonymous responses.
          </p>
        </div>
      </div>
    );
  }

  if (!feedbackRequest.isActive) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Request Inactive
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            This specific feedback topic has been closed by @{username}.
          </p>
        </div>
      </div>
    );
  }

  const serializedRequest = {
    _id: feedbackRequest._id.toString(),
    title: feedbackRequest.title,
    question: feedbackRequest.question,
    category: feedbackRequest.category,
    slug: feedbackRequest.slug,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <FeedbackForm
        recipientUsername={recipient.username}
        request={serializedRequest}
      />
    </div>
  );
}
