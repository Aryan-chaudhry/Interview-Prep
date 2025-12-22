const express = require('express');
const {getJobs, getJobLength, addJobs} = require('../Controllers/getJobs')
const protectRoute = require('../middleware/auth.middleware')
const router = express.Router();


router.get('/getjobs',protectRoute, getJobs);
router.get('/getjoblength', protectRoute, getJobLength);
router.post('/addJobs', protectRoute, addJobs);

module.exports = router;