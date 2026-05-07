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
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get AI response" },
      { status: 500 }
    );
  }
}
