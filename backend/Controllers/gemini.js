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
  // try {
    const { User, Job, Resume, isPremium } = req.body;

    if (!User || !Job) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const jobRole = Job.jobRole;
    const companyName = Job.companyName;
    
    // const result = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: [
    //     {
    //       role: "user",
    //       parts: [
    //         {
    //           text: isPremium
    //             ? `According to the prompt given to you, generate HARD and challenging interview questions.
    //             Job: ${JSON.stringify(Job)}
    //             Resume: ${Resume}
    //             Prompt: ${prompt}`
    //                             : `According to the prompt given to you, generate interview questions.
    //             Job: ${JSON.stringify(Job)}
    //             Resume: ${Resume}
    //             Prompt: ${prompt}`,
    //         },
    //       ],
    //     },
    //   ],
    // });

  //   const aiText = result.candidates[0].content.parts[0].text;

  //   const cleanedResponse = aiText
  //     .replace(/```json/g, "")
  //     .replace(/```/g, "")
  //     .trim();

  //   const aiResponseJson = JSON.parse(cleanedResponse);
  //   console.log(aiResponseJson);

  //   // ✅ 3. Save valid interview document
  //   const interviewStatus = new interviewModel({
  //     userId: User,
  //     companyName,
  //     jobRole,
  //     interviewType: "mixed", 
  //     questions: aiResponseJson.questions,
  //     totalScore: 125,          
  //   });

  //   await interviewStatus.save();
  //   console.log("Interview Status Saved")
  //   return res.status(201).json({
  //     message: "Interview Activated",
  //     interview: interviewStatus,
  //   });

  // } catch (error) {
  //   console.error("error in generating ai questions", error);

  //   return res.status(500).json({
  //     message: "Failed to generate interview questions",
  //     error: error.message,
  //   });
  //  }

const AiResponse = {
  "questions": [
    {
      "question": "Explain how React's reconciliation algorithm works and how you would optimize a React application with large component trees.",
      "category": "technical",
      "score": 10
    },
    {
      "question": "Describe how JWT-based authentication works in a MERN stack application and how you would secure protected API routes.",
      "category": "technical",
      "score": 10
    },
    {
      "question": "How would you design a scalable REST API in Node.js and Express for handling high traffic, such as an e-commerce platform like Amazon?",
      "category": "technical",
      "score": 10
    },
    {
      "question": "Explain MongoDB indexing strategies and how they improve query performance in real-world applications.",
      "category": "technical",
      "score": 10
    },
    {
      "question": "What challenges have you faced while using Socket.io for real-time applications, and how did you handle scalability?",
      "category": "technical",
      "score": 10
    },
    {
      "question": "Tell me about a time you worked on a complex full-stack project and how you managed tasks across frontend and backend.",
      "category": "behavioral",
      "score": 5
    },
    {
      "question": "Describe a situation where you had to debug a critical production issue. How did you approach it?",
      "category": "behavioral",
      "score": 5
    },
    {
      "question": "How do you prioritize features when deadlines are tight and requirements change frequently?",
      "category": "behavioral",
      "score": 5
    },
    {
      "question": "Explain a time when you had to collaborate with teammates having different technical opinions. How did you resolve it?",
      "category": "behavioral",
      "score": 5
    },
    {
      "question": "What motivates you to continuously solve coding problems and participate in competitive programming?",
      "category": "behavioral",
      "score": 5
    },
    {
      "question": "Problem: Given a string, find the length of the longest substring without repeating characters.\nExample: Input \"abcabcbb\" → Output 3 (\"abc\").\nConstraints: 1 ≤ string length ≤ 10^5; string consists of ASCII characters.",
      "category": "problem-solving",
      "score": 25
    },
    {
      "question": "Problem: Given two strings s and t, determine if t is an anagram of s.\nExample: Input s = \"anagram\", t = \"nagaram\" → Output true.\nConstraints: 1 ≤ length of s and t ≤ 10^5; strings contain lowercase English letters.",
      "category": "problem-solving",
      "score": 25
    }
  ]
}



  try {
    const interviewStatus = new interviewModel({
      userId: User,
      companyName,
      jobRole,
      interviewType: "mixed", 
      questions: AiResponse.questions,
      totalScore: 125,          
    });

    await interviewStatus.save();
    console.log("Interview Saved")

    return res.status(201).json({
      message: "Interview Activated",
      interview: interviewStatus,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};

const getInterviewQuestion = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);

  try {
    const findInterview = await interviewModel.findOne({userId});
    if(!findInterview){
      return res.status(404).json({message:"Access Denied"});
    }
    else{
      res.status(200).json({
        Questions:findInterview.questions,
      })
      console.log('Question send to frontend')
    }
    
  } catch (error) {
    console.log('Error in sending the questions to frontend', error);
    return res.status(500).json({ message: "Server error" });
  }
}


module.exports = {getResponse, setInterview, getInterviewQuestion};
