const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      required: true
    },
    posterName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },
    jobTitle: {
      type: String,
      required: true
    },
    jobRole: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    postedTime: {
      type: Date,
      required: true
    },
    jobDescription: {
      type: String,
      required: true
    },
    professionalJD: {
      type: String,
      required: true
    },
    primarySkills: {
      type: [String],
      required: true
    },
    secondarySkills: {
      type: [String],
      required: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true
    },
    workType: {
      type: String,
      enum: ["Remote", "Office", "Hybrid"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
