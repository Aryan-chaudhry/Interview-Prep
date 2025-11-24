const express = require('express');
const router = express.Router();
const {getJobs} = require('../Controllers/jobsController')

router.get('/jobs', getJobs);


module.exports = router;
