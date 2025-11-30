const express = require('express');
const getUserData = require('../Controllers/getUserData')
const router = express.Router();

router.get('/getuserData/:token', getUserData);

module.exports = router;