"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";

interface AISuggestionsProps {
  title?: string;
  question?: string;
  category?: string;
  onSelectSuggestion: (text: string) => void;
}

export function AISuggestions({
  title,
  question,
  category,
  onSelectSuggestion,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, question, category }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setHasGenerated(true);
      }
    } catch (err) {
      console.error("Failed to generate suggestions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {hasGenerated ? "AI Feedback Starters" : "Not sure what to say?"}
          </span>
        </div>

        <button
          type="button"
          onClick={fetchSuggestions}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : hasGenerated ? (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Ideas
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Generate Ideas
            </>
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSuggestion(item)}
              className="text-left rounded-xl border border-zinc-200/80 bg-white p-2.5 text-xs text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80 cursor-pointer"
            >
              &ldquo;{item}&rdquo;
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
