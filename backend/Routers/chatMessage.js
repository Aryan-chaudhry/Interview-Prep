const express = require('express');
const router = express.Router();
const protectRoute = require("../middleware/auth.middleware")
const sendMessage = require('../Controllers/message')

router.post('/send/:id', protectRoute, sendMessage);

module.exports = router;