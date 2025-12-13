const jobModel = require('../Models/jobModel');
const JobModel = require('../Models/jobModel');


const getJobs = async (req, res) => {
    try {
        const allJobs = await jobModel.find();
        return res.json(allJobs)
    } catch (error) {
        console.log('error in send jobs to frontend',error)
    }
}

module.exports = getJobs;