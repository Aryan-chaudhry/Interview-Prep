const { GoogleGenAI } = require("@google/genai");
const prompt = require('../Intelligence/geminiInterviewDB');
const interviewModel = require('../Models/interviewModel');

const ai =  new GoogleGenAI({
                apiKey: process.env.GEMINI_API_KEY,
            });

const getResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log(prompt);

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }


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

const setInterview = async (req, res) => {
  try {
    const { User, Job, Resume, isPremium } = req.body;

    if (!User || !Job) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const companyName = Job.companyName;
    const jobRole = Job.jobRole;


    
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: isPremium
                ? `According to the prompt given to you, generate HARD and challenging interview questions.
                Job: ${JSON.stringify(Job)}
                Resume: ${Resume}
                Prompt: ${prompt}`
                                : `According to the prompt given to you, generate interview questions.
                Job: ${JSON.stringify(Job)}
                Resume: ${Resume}
                Prompt: ${prompt}`,
            },
          ],
        },
      ],
    });

    const aiText = result.candidates[0].content.parts[0].text;

    const cleanedResponse = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResponseJson = JSON.parse(cleanedResponse);

    // ✅ 3. Save valid interview document
    const interviewStatus = new interviewModel({
      userId: User,
      companyName,
      jobRole,
      interviewType: "mixed", 
      questions: aiResponseJson.questions,
      totalScore: 125,          
    });

    await interviewStatus.save();

    return res.status(201).json({
      message: "Interview Activated",
      interview: interviewStatus,
    });

  } catch (error) {
    console.error("error in generating ai questions", error);

    return res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};


module.exports = {getResponse, setInterview};
