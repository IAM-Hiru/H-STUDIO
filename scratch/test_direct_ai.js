
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyDW7OuIliiJtrc3qWb9JumfUrhDK7Cp_uI";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  for (const modelName of models) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log(`Success with ${modelName}: ${response.text()}`);
      return;
    } catch (error) {
      console.error(`Error with ${modelName}: ${error.message}`);
    }
  }
}

test();
