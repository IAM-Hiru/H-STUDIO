const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey);
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env.local");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
  
  console.log("--- START DIAGNOSTIC ---");
  for (const modelName of models) {
    console.log(`Testing model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello!");
      const response = await result.response;
      console.log(`✅ ${modelName} Success: ${response.text().substring(0, 50)}...`);
    } catch (error) {
      console.log(`❌ ${modelName} Failed: ${error.message}`);
    }
  }
  console.log("--- END DIAGNOSTIC ---");
}

test();
