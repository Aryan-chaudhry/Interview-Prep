const express = require('express');
const {getResponse, setInterview, getInterviewQuestion} = require('../Controllers/gemini')
const { saveAnswers } = require('../Controllers/interviewResponse')
const router = express.Router();

router.post('/chat', getResponse);
router.post('/setup-interview', setInterview);
router.post('/save-answers', saveAnswers);
router.get('/interview-question/:id', getInterviewQuestion);
module.exports = router;