import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | UNSAID",
  description: "Privacy and anonymity guarantee of UNSAID",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        Privacy Guarantee &amp; Policy
      </h1>
      <p className="mt-2 text-xs text-zinc-400">Last updated: September 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <h2 className="font-bold text-emerald-900 dark:text-emerald-300">
            Our Architectural Anonymity Guarantee
          </h2>
          <p className="mt-1 text-emerald-800 dark:text-emerald-400">
            When you submit feedback to any user on UNSAID, <strong>we do NOT record your sender identity, user ID, or personal profile</strong> in our feedback records. Our database model intentionally lacks a sender field, ensuring your honest feedback remains strictly anonymous.
          </p>
        </section>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Data We Collect for Registered Users
        </h2>
        <p>
          For registered account holders, we store your username, email address, and encrypted password hash (salted using bcrypt). We use this data solely to provide account authentication, email OTP verification, and manage your feedback dashboard.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Third-Party Services
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Resend:</strong> Used solely to transmit email verification codes.</li>
          <li><strong>OpenAI:</strong> Used on-demand to generate helpful, non-identifiable feedback prompt suggestions.</li>
          <li><strong>MongoDB Atlas:</strong> Secure cloud database storage for encrypted credentials and anonymous feedback messages.</li>
        </ul>
      </div>
    </div>
  );
}
