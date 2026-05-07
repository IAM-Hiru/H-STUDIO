import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function getAIResponse(prompt: string, history: any[] = []) {
  const baseModels = ["gemini-3.1-flash-lite-preview", "gemini-1.5-flash", "gemini-pro"];
  const models: string[] = [];
  baseModels.forEach(m => {
    models.push(m);
    models.push(`models/${m}`);
  });

  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const systemPrompt = "You are H-STUDIO. Answer as briefly as possible. Use LaTeX for math. Be ultra-fast.";
      
      const formattedPrompt = history.length === 0 
        ? `${systemPrompt}\n\nUser: ${prompt}` 
        : `${systemPrompt}\n\nPrevious Conversation:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${prompt}`;

      const result = await model.generateContent(formattedPrompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.warn(`Model ${modelName} failed: ${error.message}`);
      lastError = error;
    }
  }

  throw lastError || new Error("All AI models failed to respond.");
}
