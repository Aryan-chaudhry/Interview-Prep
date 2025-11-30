const express = require('express');
const router = express.Router();
const {getJobs, postJobs} = require('../Controllers/jobsController')

router.get('/jobs', getJobs);
router.post('/postjobs', postJobs);


module.exports = router;
