import React from "react";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Send Anonymous Feedback to @${username} | UNSAID`,
    description: `Leave honest, constructive, and 100% anonymous feedback for ${username}.`,
  };
}

export default async function GeneralFeedbackPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  await connectDB();
  const recipient = await User.findOne({
    username: username.toLowerCase().trim(),
  }).select("username isAcceptingFeedback");

  if (!recipient) {
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
            @{username} is currently not accepting new anonymous responses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <FeedbackForm recipientUsername={recipient.username} />
    </div>
  );
}
