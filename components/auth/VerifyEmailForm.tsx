"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema, type VerifyEmailInput } from "@/lib/validations/auth";
import { verifyEmailCode, resendVerificationCode } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, KeyRound, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialCode = searchParams.get("code") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: initialEmail,
      code: initialCode,
    },
  });

  const emailValue = watch("email");

  const onSubmit = async (data: VerifyEmailInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await verifyEmailCode(data);

      if (!res.success) {
        setErrorMessage(res.error || "Verification failed.");
        return;
      }

      setSuccessMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailValue || !emailValue.includes("@")) {
      setErrorMessage("Please provide a valid email address first.");
      return;
    }

    setIsResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await resendVerificationCode(emailValue);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to resend code.");
      } else {
        if (res.devOtp) {
          setValue("code", res.devOtp);
        }
        setSuccessMessage(res.message || "A new 6-digit code has been sent!");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error resending code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-zinc-200/80 shadow-xl dark:border-zinc-800">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
          <KeyRound className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to your email address
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <p className="flex-1">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-5 w-5 text-zinc-400" />
              <Input
                {...register("email")}
                type="email"
                placeholder="utkarsh@example.com"
                className="pl-11"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                6-Digit Verification Code
              </label>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || isLoading}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </div>
            <Input
              {...register("code")}
              placeholder="e.g. 583291"
              maxLength={6}
              className="text-center font-mono text-xl tracking-[0.4em] h-12 font-bold"
              disabled={isLoading}
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying code...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
