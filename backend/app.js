const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const cookieParser = require('cookie-parser');
const {app, server} = require('./socket/socket.js')

dotenv.config();

/* ------------------ CONNECT MONGO ------------------ */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

connectDB();

/* ------------------ EXPRESS + SOCKET SERVER ------------------ */


app.use(cors({
  origin:"http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

/* ------------------ ROUTERS (UNCHANGED) ------------------ */
const jobsRouter = require('./Routers/jobsRouter.js');
const extractPdfText = require('./Routers/resumeScanner.js');
const Authentication = require('./Routers/Authentication.js');
const completeTestToken = require('./Routers/TestComplete.js');
const userData = require('./Routers/UserData.js');
const codeExecutor = require('./Routers/codeExecutor.js');
const chatmessages = require("./Routers/chatMessage.js");

app.use('/api', jobsRouter);
app.use('/api', extractPdfText);
app.use('/api', Authentication);
app.use('/api', completeTestToken);
app.use('/api', userData);
app.use('/api', codeExecutor);
app.use('/api', chatmessages);

app.get('/', (req, res) => res.send('Server is running...'));



const { GoogleGenAI } = require("@google/genai");


// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });


// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   // Receive user speech-to-text input in real-time
//   socket.on("user-text", async (userMessage) => {
//     console.log("User:", userMessage);

//     try {
//       /* ------ PREPARE PROMPT ------ */
//       const prompt = `
//         You are an AI Interviewer.
//         Keep answers short (2–3 sentences).
//         Candidate said: "${userMessage}"
//         Respond naturally and ask a relevant follow-up question.
//       `;

//       /* ----------- GEMINI AI RESPONSE ----------- */
//       const result = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: prompt }]
//           }
//         ]
//       });

//       const aiText =
//         result.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "I couldn't generate a response.";

//       console.log("AI:", aiText);

//       /* ----------- MURF TTS (YOUR EXACT CODE) ----------- */
//       const ttsUrl = "https://global.api.murf.ai/v1/speech/stream";

//       const ttsData = {
//         voiceId: "hi-IN-aman",
//         style: "Conversational",
//         text: aiText,
//         multiNativeLocale: "hi-IN",
//         model: "FALCON",
//         format: "MP3",
//         sampleRate: 24000,
//         channelType: "MONO",
//       };

//       const ttsConfig = {
//         method: "post",
//         url: ttsUrl,
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": process.env.VOICE_API,
//         },
//         data: ttsData,
//         responseType: "arraybuffer",
//         timeout: 20000,
//       };

//       let audioBase64 = null;

//       try {
//         const audioResponse = await axios(ttsConfig);
//         audioBase64 = Buffer.from(audioResponse.data).toString("base64");
//       } catch (error) {
//         console.log("Murf TTS Error:", error.message);
//       }

//       /* ----------- SEND BACK AI TEXT + AUDIO ----------- */
//       socket.emit("ai-text", aiText);
//       socket.emit("ai-audio", audioBase64);

//     } catch (error) {
//       console.error("AI Error:", error.message);
//       socket.emit("ai-text", "Sorry, something went wrong.");
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
