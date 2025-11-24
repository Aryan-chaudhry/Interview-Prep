const express = require('express');
const router = express.Router();
const TokenFunction = require('../Controllers/Interview')


router.get('/getToken', TokenFunction);

module.exports = router;