const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      console.log("Models found:", data.models.map(m => m.name));
    } else {
      console.log("No models found. Response:", data);
    }
  })
  .catch(err => console.error("Fetch error:", err));
