const jobModel = require('../Models/jobModel');


async function getJobs(req, res) {
  try {
    const jobs = await jobModel.find();
    return res.json(jobs);
  } catch (error) {
    console.log('error in sending jobs message from backend', error);
  }
}


module.exports = { getJobs };
