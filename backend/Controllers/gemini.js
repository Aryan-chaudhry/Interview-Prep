const { GoogleGenAI } = require("@google/genai");
const prompt = require('../Intelligence/geminiInterviewDB');
const resultprompt = require('../Intelligence/geminiResultDB')
const interviewModel = require('../Models/interviewModel');
const resultModel = require('../Models/resultModel');

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
                parts: [{ text: `You are an expert Interview Prep AI Agent. Your role is to help users ace their interviews with SHORT, IMPRESSIVE, and ENGAGING responses. Key rules:\n\n1. ALWAYS keep responses BRIEF (2-3 sentences max per message)\n2. Use clear formatting with • bullet points and **bold** for emphasis\n3. Ask engaging follow-up questions to keep the user talking\n4. Be confident, encouraging, and job-focused\n5. Never give long paragraphs - break into short punchy lines\n6. Show genuine interest in helping the user succeed\n\nUser's request:\n${prompt} the first message give to you is always about the jib what aver the long conversation it will be always remember that job data ok and always give answer related to that` }]
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

    const jobRole = Job.jobRole;
    const companyName = Job.companyName;
    const jobId = Job._id;
    

    // 🔹 1. CHECK IF INTERVIEW ALREADY EXISTS
    const existingInterview = await interviewModel.findOne({
      jobId: jobId,
    });

    if (existingInterview) {
      return res.status(200).json({
        message: "Interview already activated",
        interview: existingInterview,
        fromCache: true, // optional flag
      });
    }

    // 🔹 2. IF NOT EXISTS → CALL GEMINI
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: isPremium
                ? `
Generate slightly hard interview questions.
Rules:
- 80% questions MUST be based on resume
- Remaining based on job role
- Output ONLY valid JSON
- Follow schema exactly

Job: ${JSON.stringify(Job)}
Resume: ${Resume}
Prompt: ${prompt}
`
                : `
Generate easy interview questions.
Rules:
- 90% questions MUST be based on resume
- Output ONLY valid JSON
- Follow schema exactly

Job: ${JSON.stringify(Job)}
Resume: ${Resume}
Prompt: ${prompt}
`,
            },
          ],
        },
      ],
    });

    const aiText = result.candidates[0].content.parts[0].text;

    // 🔹 3. CLEAN + PARSE RESPONSE
    const cleanedResponse = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResponseJson = JSON.parse(cleanedResponse);

    if (!aiResponseJson?.questions?.length) {
      throw new Error("Invalid AI response format");
    }

    // 🔹 4. SAVE INTERVIEW
    const interviewStatus = new interviewModel({
      userId: User,
      jobId:jobId,
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
      fromCache: false,
    });

  } catch (error) {
    console.error("Error in generating interview:", error);

    return res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};


const getInterviewQuestion = async (req, res) => {
  const jobId = req.params.id;
  console.log("jobId : ", jobId);

  try {
    const findInterview = await interviewModel
    .findOne({jobId})
    .sort({ createdAt: -1 })
    .exec();

    if(findInterview){
      res.status(200).json({
        Questions:findInterview.questions,
      })
      console.log('Question send to frontend')  
    }
    else{
       return res.status(404).json({message:"Access Denied"});
    }
    
  } catch (error) {
    console.log('Error in sending the questions to frontend', error);
    return res.status(500).json({ message: "Server error" });
  }
}


const generateResult = async (req, res) => {
  console.log("RESULT TRIGGER....................................");

  const jobId = req.params.id;
  const { conversation, userId } = req.body;

  console.log("conversation:", conversation);
  console.log("userId:", userId);
  console.log("jobId : ", jobId );


  if (!conversation || !conversation.length) {
    return res.status(400).json({ message: "Conversation missing" });
  }

  const latestInterview = await interviewModel
    .findOne({ jobId });

  if (!latestInterview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  const questions = latestInterview.questions;
  console.log("Received Interview Questions:", questions);

  const payLoad = {
    conversation,
    questions,
    Rulebook: resultprompt,
  }

  const finalText = JSON.stringify(payLoad, null, 2);

  console.log("Payload for Gemini:", finalText);

  try {
    

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: finalText }],
        },
      ],
    });

    const aiText =
      result.candidates?.[0]?.content?.parts?.[0]?.text;

    const cleanedResponse = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResponseJson = JSON.parse(cleanedResponse);

    console.log("FINAL AI RESULT JSON:", aiResponseJson);

    const Result = new resultModel({
      userId,
      jobId:jobId,
      totalScore: aiResponseJson.feedback.rating.TotalScore,  
      confidenceLevel: aiResponseJson.feedback.rating.ConfidenceLevel,
      knowledgeLevel: aiResponseJson.feedback.rating.KnowledgeLevel,
      Rank:aiResponseJson.feedback.rating.Rank,
      feedback: aiResponseJson.feedback.summary + " " + aiResponseJson.feedback.recommendationMsg,
    });

    await Result.save();
    console.log("Interview Result Saved");
    
  } catch (error) {
    console.error("AI RESULT ERROR:", error);
    return res.status(500).json({
      message: "Failed to generate interview result",
      error: error.message,
    });
  }
};




module.exports = {getResponse, setInterview, getInterviewQuestion, generateResult};
