const dotenv = require('dotenv');
dotenv.config();

// NOTE: These libraries must be installed in backend:
// npm install @google/generative-ai @google-cloud/text-to-speech @google-cloud/speech multer

const { GoogleGenerativeAI } = require('@google/generative-ai');
const textToSpeech = require('@google-cloud/text-to-speech');
const speech = require('@google-cloud/speech').SpeechClient;

let ttsClient;
let speechClient;
let genAI;

// Validate environment early and create clients defensively
const ensureClients = () => {
    if (!genAI) {
        if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            throw new Error('No GEMINI_API_KEY or GOOGLE_APPLICATION_CREDENTIALS found in environment. Set one to use Gemini/Google APIs.');
        }

        try {
            genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
        } catch (e) {
            console.warn('Could not initialize GoogleGenerativeAI client with API key; will attempt ADC if available.');
            try {
                genAI = new GoogleGenerativeAI();
            } catch (inner) {
                console.error('Failed to initialize GoogleGenerativeAI client:', inner);
            }
        }
    }

    if (!ttsClient) {
        try {
            ttsClient = new textToSpeech.TextToSpeechClient();
        } catch (e) {
            console.error('Failed to initialize TextToSpeech client:', e);
            throw e;
        }
    }

    if (!speechClient) {
        try {
            speechClient = new speech();
        } catch (e) {
            console.error('Failed to initialize Speech-to-Text client:', e);
            throw e;
        }
    }
};

// POST /api/gemini/ask
// body: { prompt?: string, history?: string }
exports.ask = async (req, res) => {
    try {
        ensureClients();

        const { prompt, history } = req.body || {};

        // Build a simple instruction for the model
        const instruction = prompt || 'You are an interviewer. Ask a concise technical interview question to the candidate.';

        if (!genAI) {
            throw new Error('Generative AI client not initialized. Check GEMINI_API_KEY or ADC credentials.');
        }

        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });

        const response = await model.generateContent({ input: instruction });

        const text = response?.response?.text || 'Could not generate a question.';

        // Synthesize TTS (MP3) using Google Cloud Text-to-Speech
        const ttsRequest = {
            input: { text },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' }
        };

        const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
        const audioContent = ttsResponse.audioContent; // Buffer
        const audioBase64 = audioContent.toString('base64');

        res.json({ text, audio: audioBase64 });
    } catch (err) {
        console.error('Gemini ask error:', err && err.stack ? err.stack : err);
        // Return a helpful error message for debugging (avoid leaking secrets)
        res.status(500).json({ error: 'Gemini ask failed', details: err.message || String(err) });
    }
};

// POST /api/gemini/asr  (multipart form-data file upload field: file)
// returns: { transcript }
exports.asr = async (req, res) => {
    try {
        ensureClients();

        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const audioBuffer = req.file.buffer;
        const audioBytes = audioBuffer.toString('base64');

        const audio = {
            content: audioBytes
        };

        const config = {
            encoding: 'WEBM_OPUS', // best guess for browser MediaRecorder on many browsers
            sampleRateHertz: 48000,
            languageCode: 'en-US'
        };

        const request = {
            audio: audio,
            config: config
        };

        const [response] = await speechClient.recognize(request);
        const transcription = (response.results || [])
            .map(result => (result.alternatives && result.alternatives[0] && result.alternatives[0].transcript) || '')
            .join('\n');

        res.json({ transcript: transcription });
    } catch (err) {
        console.error('ASR error:', err && err.stack ? err.stack : err);
        res.status(500).json({ error: 'ASR failed', details: err.message || String(err) });
    }
};
