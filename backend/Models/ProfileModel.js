const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },

    rank: {
      type: Number,
      required: true,
      default: 3000000,
      min: 1
    },

    numberOfInterviews: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    bestOfInterview: {
      type: String,
      required: false,
      default: "Not Available",
      trim: true
    },

    score: {
      type: Number,
      required: false,
      default: 0,
      min: 0
    },

    interviewType: {
      type: String,
      required: true,
      trim: true
    },

    interviewName: {
      type: String,
      required: true,
      trim: true
    },

    duration: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
