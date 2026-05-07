import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function getAIResponse(prompt: string, history: { role: string, content: string }[] = []) {
  const models = [
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
  ];


  let lastError: Error | null = null;

  for (const modelName of models) {
    try {
      console.log(`[AI] Attempting with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const systemPrompt = "You are H-STUDIO. Answer as briefly as possible. Use LaTeX for math. Be ultra-fast.";
      
      const formattedPrompt = history.length === 0 
        ? `${systemPrompt}\n\nUser: ${prompt}` 
        : `${systemPrompt}\n\nPrevious Conversation:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${prompt}`;

      const result = await model.generateContent(formattedPrompt);
      const response = await result.response;
      const text = response.text();
      console.log(`[AI] Success with ${modelName}`);
      return text;
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`[AI] Model ${modelName} failed:`, err.message);
      lastError = err;
      
      if (err.message?.includes("429") || err.message?.includes("quota")) {
        console.error("[AI] Quota exceeded.");
      }
    }
  }


  const errorMessage = lastError?.message || "All AI models failed.";
  console.error("[AI] Final Error:", errorMessage);
  
  if (errorMessage.includes("429") || errorMessage.includes("quota")) {
    throw new Error("API Quota Exceeded. Please try again later.");
  }
  
  throw new Error(`AI Service Error: ${errorMessage}`);
}
