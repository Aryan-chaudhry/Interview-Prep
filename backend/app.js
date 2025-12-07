const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

connectDB();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

/* -------------------- ROUTERS -------------------- */
const jobsRouter = require('./Routers/jobsRouter.js');
const extractPdfText = require('./Routers/resumeScanner.js');
const Authentication = require('./Routers/Authentication.js');
const completeTestToken = require('./Routers/TestComplete.js');
const userData = require('./Routers/UserData.js');
const codeExecutor = require('./Routers/codeExecutor.js');

app.use('/api', jobsRouter);
app.use('/api', extractPdfText);
app.use('/api', Authentication);
app.use('/api', completeTestToken);
app.use('/api', userData);
app.use('/api', codeExecutor);

/* -------------------- ROOT ROUTE -------------------- */
app.get('/', (req, res) => res.send('Server is running...'));


/* -------------------- GEMINI AI INTERVIEW (FINAL WORKING VERSION) -------------------- */
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/api/communicate", async (req, res) => {
  try {
    const userMessage = req.query.message;
    const candidate = req.query;

    if (!userMessage)
      return res.status(400).json({ error: "Message is required" });

    const prompt = `
      You are a professional AI Interviewer.
      Keep answers SHORT (2-3 sentences).
      Candidate details: ${JSON.stringify(candidate)}
      Candidate said: "${userMessage}"
      Respond naturally and ask a relevant follow-up question.
    `;

    /* ----------- GOOGLE GEN AI REQUEST (FIXED) ----------- */
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    // Proper text extraction
    const aiText = result.candidates[0].content.parts[0].text;

    /* ------------------ TEXT → SPEECH ------------------ */
    const axios = require("axios");

    const url = "https://global.api.murf.ai/v1/speech/stream";
    const data = {
      voiceId: "hi-IN-aman",
      style: "Conversational",
      text: aiText,
      multiNativeLocale: "hi-IN",
      model: "FALCON",
      format: "MP3",
      sampleRate: 24000,
      channelType: "MONO",
    };

    const config = {
      method: "post",
      url,
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.VOICE_API,
      },
      data,
      responseType: "arraybuffer",
      timeout: 15000,
    };

    let audioData = null;

    try {
      const audioResponse = await axios(config);
      audioData = Buffer.from(audioResponse.data).toString("base64");
    } catch (audioError) {
      console.error("Murf AI Error:", audioError.message);

      return res.status(200).json({
        text: aiText,
        audio: null,
        audioError: true,
      });
    }

    return res.status(200).json({
      text: aiText,
      audio: audioData,
    });

  } catch (error) {
    console.error("AI Error:", error.message);
    return res.status(500).json({ error: "AI failed to generate a response" });
  }
});


/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
