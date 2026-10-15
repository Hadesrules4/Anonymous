import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageSquareDashed,
  ShieldCheck,
  Sparkles,
  Lock,
  BarChart3,
  ArrowRight,
  Share2,
  CheckCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-transparent to-transparent dark:from-zinc-900 dark:via-zinc-950" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Truly Anonymous Feedback Engine
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
            Anonymous feedback. <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              Honest perspectives.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Create targeted feedback requests, share custom links with peers, and
            receive unfiltered, constructive advice without knowing who submitted
            each response.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {session?.user ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 h-12 px-8 text-base rounded-2xl">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base rounded-2xl">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-2xl">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Interactive Preview Mock */}
          <div className="mt-14 mx-auto max-w-2xl rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900/90 text-left">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-zinc-400 font-mono ml-2">unsaid.com/feedback/alex/placement-prep</span>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Live Prompt
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="text-xs font-semibold uppercase text-zinc-400">
                Alex wants feedback &bull; Career
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Placement Preparation: What should I improve before interviews?
              </h3>
              <div className="rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
                &ldquo;You should practice explaining your architectural tradeoffs more clearly. Your code is solid, but the thought process needs to be voiced out loud.&rdquo;
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span>Sender: <strong className="text-zinc-700 dark:text-zinc-300">UNKNOWN (Anonymous)</strong></span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/50 py-16 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Engineered for genuine, actionable insights
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Why generic feedback forms fail, and how UNSAID makes honesty safe and constructive.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Architectural Anonymity
              </h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                We intentionally omit the sender identity from our database schema. It is technically impossible for anyone to identify who sent a message.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Contextual AI Prompts
              </h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                Integrated OpenAI suggestions help respondents overcome writer&apos;s block and formulate constructive, actionable feedback.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Visual Analytics
              </h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                Track feedback patterns by category, volume, and response trends using interactive Recharts data visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              How UNSAID Works
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Three simple steps to start receiving valuable, candid feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xl font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Create a Topic
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Define a specific question like &ldquo;Placement Preparation&rdquo; or &ldquo;Portfolio Review&rdquo; rather than a vague open prompt.
              </p>
            </div>

            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xl font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Share the Link
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Copy your unique link to WhatsApp, LinkedIn, Discord, or Slack. Visitors do not need an account to respond.
              </p>
            </div>

            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xl font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Read Honest Feedback
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                View anonymous submissions in your inbox, track categorical insights, and grow from candid perspectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200/80 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">UNSAID</span>
            <span>&bull; Anonymous feedback. Honest perspectives.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              About
            </Link>
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
