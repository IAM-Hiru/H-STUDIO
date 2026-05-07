const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = "AIzaSyBz7u1UoEAlkV6tYn76X_iNcsWeJs3iLTs";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      const genModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
      console.log("AVAILABLE GENERATION MODELS:");
      genModels.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } else {
      console.log("Error:", JSON.stringify(data));
    }
  } catch (error) {
    console.log("Fetch Error:", error.message);
  }
}

listModels();
