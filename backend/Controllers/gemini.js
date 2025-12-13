const { GoogleGenAI } = require("@google/genai");

const getResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log(prompt);

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [{ text: `You are an expert Interview Prep AI Agent. Your role is to help users ace their interviews with SHORT, IMPRESSIVE, and ENGAGING responses. Key rules:\n\n1. ALWAYS keep responses BRIEF (2-3 sentences max per message)\n2. Use clear formatting with • bullet points and **bold** for emphasis\n3. Ask engaging follow-up questions to keep the user talking\n4. Be confident, encouraging, and job-focused\n5. Never give long paragraphs - break into short punchy lines\n6. Show genuine interest in helping the user succeed\n\nUser's request:\n${prompt}` }]
              }
            ]
        });

        const aiText =
            result.candidates?.[0]?.content?.parts?.[0]?.text ||
            result.text ||
            "AI could not generate a response";

        return res.status(200).json({ response: aiText });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({
            message: "Error communicating with AI",
            error: error.message
        });
    }
};

module.exports = getResponse;
