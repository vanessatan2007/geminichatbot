const dotenv = require("dotenv");
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables from the .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8,
  },
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

app.post("/generate-response", async (req, res) => {
  const { prompt } = req.body;

  try {
    const gemResponse = await model.generateContent({ text: prompt });
    const generatedText = gemResponse.response.text();
    res.json({ response: generatedText });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
