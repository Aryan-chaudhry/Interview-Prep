const express = require('express');
const {getResponse, setInterview} = require('../Controllers/gemini')
const router = express.Router();

router.post('/chat', getResponse);
router.post('/setup-interview', setInterview);
module.exports = router;