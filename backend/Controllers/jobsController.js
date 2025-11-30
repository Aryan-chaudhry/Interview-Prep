const jobModel = require('../Models/jobModel');


async function getJobs(req, res) {
  try {
    const jobs = await jobModel.find();
    return res.json(jobs);
  } catch (error) {
    console.log('error in sending jobs message from backend', error);
  }
}


const postJobs = async (req, res) => {
  try {
    const job = new jobModel(req.body);
    await job.save();
    console.log('job addedd successfully')
  } catch (error) {
    console.log('error in adding a job', error);
  }
}

module.exports = { getJobs, postJobs };
