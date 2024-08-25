// Import required modules
import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Initialize Google Generative AI with the provided API key
if (!process.env.API_KEY) {
  console.error("API_KEY is missing from .env");
  process.exit(1); // Exit the application if API_KEY is missing
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8,
  },
});

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Serve static files (e.g., HTML, CSS, JS) from the "public" directory
app.use(express.static('public'));

// Handle POST request to "/generate-response"
app.post("/generate-response", async (req, res) => {
  const { prompt } = req.body;

  try {
    // Generate content using Google Generative AI
    const gemResponse = await model.generateContent({ text: prompt });

    // Check if the response is valid
    if (!gemResponse || !gemResponse.response) {
      throw new Error("Invalid response from the AI model");
    }

    // Extract the generated text from the response
    const generatedText = gemResponse.response.text();
    res.json({ response: generatedText });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
