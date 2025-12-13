const jobModel = require('../Models/jobModel');
const jobs = require('./jobs.json');

const AddJobs = async () => {
    try {
        await jobModel.insertMany(jobs);
        console.log('Jobs inserted successfully');
    } catch (error) {
        console.log('error in adding the jobs');
    }
}

module.exports = AddJobs;