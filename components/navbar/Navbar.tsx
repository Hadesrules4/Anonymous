import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "./UserMenu";
import { MessageSquareDashed, ShieldCheck } from "lucide-react";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900">
            <MessageSquareDashed className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-lg">
              UNSAID
            </span>
            <span className="text-[10px] uppercase font-medium tracking-wider text-zinc-400 dark:text-zinc-500 -mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              100% Anonymous
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/about"
            className="transition hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            About
          </Link>
          <Link
            href="/#how-it-works"
            className="transition hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            How it Works
          </Link>
          <Link
            href="/privacy"
            className="transition hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            Privacy Guarantee
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                Dashboard
              </Link>
              <UserMenu user={session.user} />
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
