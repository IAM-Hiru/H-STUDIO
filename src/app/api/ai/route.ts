import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await getAIResponse(prompt, history);

    return NextResponse.json({ text: response });
  } catch (error: unknown) {
    console.error("AI Error:", error);
    
    const err = error as Error;
    let message = err.message || "Failed to get AI response";
    if (message.includes("leaked") || message.includes("API key")) {
      message = "Your Gemini API key is invalid or has been revoked. Please update it in .env.local.";
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
