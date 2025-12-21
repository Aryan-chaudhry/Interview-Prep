const express = require('express');
const getResult = require('../Controllers/Result')
const router = express.Router();

router.get('/getResult/:id', getResult);

module.exports = router;