import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | UNSAID",
  description: "Learn about the mission and architecture of UNSAID",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        About UNSAID
      </h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        UNSAID was developed to solve a universal dilemma: people want honest, constructive feedback to grow, but social awkwardness and fear of hurting relationships prevent peers from speaking candidly.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Why Contextual Feedback Matters
        </h2>
        <p>
          Traditional anonymous feedback sites fail because they offer empty boxes without direction, inviting spam and low-effort comments. UNSAID changes this by introducing <strong>Contextual Requests</strong>. Users specify exactly what they want feedback on — whether it is preparing for upcoming placement interviews, reviewing a portfolio website, or improving team communication.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Built-in Anti-Abuse &amp; Privacy Controls
        </h2>
        <p>
          Anonymity should never come at the expense of safety. UNSAID implements rate limiting, length limits, profanity filters, and request toggling so creators always maintain full control over who can submit feedback and when.
        </p>
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="/signup">
          <Button className="rounded-xl">Create Your Account</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="rounded-xl">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
