import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function generateFeedbackSuggestions({
  title,
  question,
  category,
}: {
  title?: string;
  question?: string;
  category?: string;
}): Promise<string[]> {
  const fallbackSuggestions = [
    `What are my biggest strengths in ${category || "this area"}, and where could I push further?`,
    `Could you give a concrete example of something I could do differently or improve?`,
    `What is one thing that holds back the impact of my work or communication?`,
    `If you had to suggest one skill or habit for me to develop next, what would it be?`,
  ];

  if (!openai) {
    return fallbackSuggestions;
  }

  try {
    const prompt = `You are helping an anonymous visitor provide constructive, thoughtful, and actionable feedback to someone on a platform called UNSAID.
The feedback request details are:
Topic: "${title || "General Feedback"}"
Prompt Question: "${question || "What can I improve?"}"
Category: "${category || "General"}"

Generate exactly 4 concise, diverse, constructive feedback prompts/starters that someone could write in response.
Return ONLY 4 lines separated by newlines, with NO numbers, bullets, or quotation marks.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return fallbackSuggestions;

    const suggestions = content
      .split("\n")
      .map((line) => line.replace(/^[\d\.\-\*\•\s"']+|["']+$/g, "").trim())
      .filter((line) => line.length > 5);

    return suggestions.length > 0 ? suggestions.slice(0, 4) : fallbackSuggestions;
  } catch (error) {
    console.error("OpenAI suggestions error:", error);
    return fallbackSuggestions;
  }
}
