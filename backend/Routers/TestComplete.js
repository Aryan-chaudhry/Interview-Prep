const express = require('express');
const generateToken = require('../Controllers/getTestToken')
const router = express.Router();


router.get('/test-token', generateToken);

module.exports = router;