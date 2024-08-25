require('dotenv').config();
const readlineSync = require('readline-sync');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.8,
    },
});

// Function to get user input and generate a response
async function chatLoop() {
    let keepGoing = true;

    while (keepGoing) {
        // Get user input
        const prompt = readlineSync.question('You: ');

        // Check if the user wants to stop the conversation
        if (prompt.toLowerCase() === 'stop') {
            console.log("Conversation ended.");
            keepGoing = false;
            break;
        }

        // Generate response from the model
        try {
            const gemResponse = await model.generateContent({ text: prompt });

            if (!gemResponse || !gemResponse.response) {
                throw new Error("Invalid response from the AI model");
            }

            const generatedText = gemResponse.response.text();
            console.log(`Gemini: ${generatedText}`);
        } catch (error) {
            console.error("Error generating content:", error.message);
        }
    }
}

// Start the chat loop
chatLoop();
