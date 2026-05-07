const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = "AIzaSyBz7u1UoEAlkV6tYn76X_iNcsWeJs3iLTs";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // We have to use the direct fetch because the SDK doesn't have a clean listModels
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("AVAILABLE MODELS:");
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("No models found or error:", JSON.stringify(data));
    }
  } catch (error) {
    console.log("Fetch Error:", error.message);
  }
}

listModels();
