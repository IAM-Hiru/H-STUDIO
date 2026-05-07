const { GoogleGenerativeAI } = require("@google/generative-ai");

async function list() {
  const apiKey = "AIzaSyBz7u1UoEAlkV6tYn76X_iNcsWeJs3iLTs";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // There is no direct "listModels" in the SDK, but we can try to find them
    console.log("Checking API access...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Key is initialized.");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

list();
