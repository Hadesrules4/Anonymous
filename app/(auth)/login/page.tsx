import React, { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | UNSAID",
  description: "Sign in to your Unsaid dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-zinc-400">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
