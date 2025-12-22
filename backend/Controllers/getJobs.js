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


const getJobLength = async (req, res) => {
    try {
        const jobLength = await jobModel.countDocuments();
        return res.json({length:jobLength})
    } catch (error) {
        console.log('error in getting job length', error);
        res.json({message:"Error in getting job length"})
    }
}



const addJobs = async (req, res) => {
  try {
    const {
      id,
      companyName,
      posterName,
      email,
      gender,
      jobTitle,
      jobRole,
      location,
      postedTime,
      jobDescription,
      professionalJD,
      primarySkills,
      secondarySkills,
      rating,
      workType
    } = req.body;

    // 🔒 Validation
    if (
      !id ||
      !companyName ||
      !posterName ||
      !email ||
      !gender ||
      !jobTitle ||
      !location ||
      !postedTime ||
      !jobDescription ||
      !professionalJD ||
      !primarySkills?.length ||
      !secondarySkills?.length ||
      rating === undefined ||
      !workType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Ensure jobRole always exists
    const finalJobRole = jobRole && jobRole.trim() !== ""
      ? jobRole
      : jobTitle;

    // 🚀 Create Job
    const job = new JobModel({
      id,
      companyName: companyName.trim(),
      posterName: posterName.trim(),
      email: email.trim(),
      gender,
      jobTitle: jobTitle.trim(),
      jobRole: finalJobRole.trim(),
      location: location.trim(),
      postedTime: new Date(postedTime),
      jobDescription: jobDescription.trim(),
      professionalJD: professionalJD.trim(),
      primarySkills,
      secondarySkills,
      rating,
      workType
    });

    await job.save();

    return res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error("Add Job Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Job ID already exists" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};



module.exports = {getJobs, getJobLength, addJobs};