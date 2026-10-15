import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | UNSAID",
  description: "Terms and acceptable use policy of UNSAID",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        Terms of Service &amp; Acceptable Use
      </h1>
      <p className="mt-2 text-xs text-zinc-400">Last updated: September 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          1. Acceptable Use &amp; Anti-Harassment
        </h2>
        <p>
          UNSAID is designed to provide constructive, honest, and helpful perspectives. Anonymity is provided to remove fear of judgment, not to enable harassment, hate speech, bullying, defamation, or threats of violence.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          2. Content Moderation &amp; Enforcement
        </h2>
        <p>
          We employ automated filters, rate limiting, and reporting mechanisms. Any messages determined to contain malicious, abusive, or unlawful content may be purged without notice. Account owners have full discretion to delete any feedback or pause incoming submissions at any time.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          3. Disclaimer of Warranties
        </h2>
        <p>
          The service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. UNSAID makes no representations or warranties of any kind regarding content submitted by third parties.
        </p>
      </div>
    </div>
  );
}
