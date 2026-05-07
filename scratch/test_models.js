const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // There is no direct listModels in the SDK like this, usually you'd use the REST API or another method.
    // But let's try a common one that usually works.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    console.log("gemini-pro works");
  } catch (e) {
    console.log("gemini-pro failed:", e.message);
  }
}
listModels();
