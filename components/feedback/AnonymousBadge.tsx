import React from "react";
import { ShieldCheck, EyeOff, Lock } from "lucide-react";

export function AnonymousBadge() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
      <div className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-200">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>100% Anonymous</span>
      </div>
      <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">&bull;</span>
      <div className="flex items-center gap-1.5">
        <EyeOff className="h-4 w-4 text-blue-500" />
        <span>No sender ID or account tracked</span>
      </div>
      <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">&bull;</span>
      <div className="flex items-center gap-1.5">
        <Lock className="h-4 w-4 text-amber-500" />
        <span>Encrypted in transit</span>
      </div>
    </div>
  );
}
