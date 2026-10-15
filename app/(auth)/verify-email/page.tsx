import React, { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | UNSAID",
  description: "Verify your email address using the 6-digit OTP code",
};

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-zinc-400">Loading verification form...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
