const express = require('express');
const {getResponse, setInterview, getInterviewQuestion} = require('../Controllers/gemini')
const router = express.Router();

router.post('/chat', getResponse);
router.post('/setup-interview', setInterview);
router.get('/interview-question/:id', getInterviewQuestion);

module.exports = router;