const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenAI } = require("@google/genai");


const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey});
async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();

