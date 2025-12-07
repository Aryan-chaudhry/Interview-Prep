const express = require('express');
const { executeCode } = require('../Controllers/codeExecutor');
const router = express.Router();

router.post('/execute-code', executeCode);

module.exports = router;
