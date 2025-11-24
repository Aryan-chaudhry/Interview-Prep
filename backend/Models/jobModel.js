const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  posterName: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  profilePhoto: { type: String, required: true },

  jobTitle: { type: String, required: true },
  jobRole: { type: String, required: true },
  location: { type: String, required: true },

  postedTime: { type: String, required: true },
  jobDescription: { type: String, required: true },

  professionalJD: { type: String, required: true },

  primarySkills: { type: [String], required: true },
  secondarySkills: { type: [String], required: true },

  rating: { type: Number, default: 0 },
  workType: { type: String, enum: ["Remote", "Hybrid", "Office"], required: true }
});

module.exports = mongoose.model('Job', jobSchema);