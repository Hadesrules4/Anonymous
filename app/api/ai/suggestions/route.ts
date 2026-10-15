import { NextResponse } from "next/server";
import { generateFeedbackSuggestions } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, question, category } = body;

    const suggestions = await generateFeedbackSuggestions({
      title,
      question,
      category,
    });

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error: any) {
    console.error("AI suggestions API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate suggestions",
      },
      { status: 500 }
    );
  }
}
