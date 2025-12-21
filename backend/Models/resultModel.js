const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true, // IMPORTANT for fast queries
    },

    jobId:{
      type:String,
      ref:"job",
      required:true,
    },
  
    totalScore: {
      type: Number,
      required: true,
    },

    confidenceLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    knowledgeLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    Rank:{
      type:Number,
      required:true,
    },
    feedback: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("InterviewResult", resultSchema);
