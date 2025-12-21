const express = require('express');
const {getResponse, setInterview, getInterviewQuestion, generateResult} = require('../Controllers/gemini')
const router = express.Router();

router.post('/chat', getResponse);
router.post('/setup-interview', setInterview);
router.get('/interview-question/:id', getInterviewQuestion);
router.post('/interview-result/:id', generateResult);

module.exports = router;