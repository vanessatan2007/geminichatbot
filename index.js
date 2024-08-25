require('dotenv').config(); // Load environment variables
const { GoogleGenerativeAI } = require('@google/generative-ai');
const readlineSync = require('readline-sync');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.8,
    },
});

async function chatLoop() {
    let keepGoing = true;
    console.log("Hi, I'm chatbot gemini, chat with me about anything. Say stop anytime.git ")
    while (keepGoing) {
        // Get user input
        const prompt = readlineSync.question('You: ');

        // Check if the user wants to stop the conversation
        if (prompt.toLowerCase() === 'stop') {
            console.log("Byebye, see you soon");
            keepGoing = false;
            break;
        }

        // Generate response from the model
        try {
            // Ensure the method and response are correct
            const response = await model.generateContent(prompt);

            // Check if response is valid and extract text
            if (!response || !response.response || typeof response.response.text !== 'function') {
                throw new Error("Invalid response from the AI model");
            }

            const generatedText = response.response.text();
            console.log(`Gemini: ${generatedText}`);
        } catch (error) {
            console.error("Error generating content:", error.message);
        }
    }
}

// Start the chat loop
chatLoop();
