const express = require('express');
const getResponse = require('../Controllers/gemini')
const router = express.Router();

router.post('/chat', getResponse);

module.exports = router;