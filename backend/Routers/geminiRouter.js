const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // memory storage

const geminiController = require('../Controllers/geminiController');

router.post('/ask', express.json(), geminiController.ask);
router.post('/asr', upload.single('file'), geminiController.asr);

// Simple status endpoint to verify credentials/clients
router.get('/status', (req, res) => {
	// Do a lightweight check of environment variables
	const hasGeminiKey = !!process.env.GEMINI_API_KEY;
	const hasGCloud = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
	res.json({ ok: true, geminiKey: hasGeminiKey, googleADC: hasGCloud });
});

module.exports = router;
