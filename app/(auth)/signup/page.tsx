import React from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | UNSAID",
  description: "Sign up to start receiving honest, anonymous feedback",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}
