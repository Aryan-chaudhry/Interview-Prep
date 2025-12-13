const express = require('express');
const getJobs = require('../Controllers/getJobs')
const protectRoute = require('../middleware/auth.middleware')
const router = express.Router();


router.get('/getjobs',protectRoute, getJobs);

module.exports = router;