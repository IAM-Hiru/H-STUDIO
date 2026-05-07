const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = "AIzaSyBz7u1UoEAlkV6tYn76X_iNcsWeJs3iLTs";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  
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
