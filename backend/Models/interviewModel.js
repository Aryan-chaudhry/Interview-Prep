const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User", 
      required:true,    
    },
    jobId:{
      type:String,
      ref:"job",
      required:true,
    },
    companyName: {
      type: String,
      trim: true,
      required:true,
    },

    jobRole: {
      type: String,
      trim: true,
      required:true,
    },

    interviewType: {
      type: String,
      required:true,
      
    },

    questions: [
      {
        question: {
          type: String,  
          required: true,
        },
        category: {
          type: String,
          enum: ["technical", "behavioral", "problem-solving"],
        },
        score: {
          type: Number,
          min: 0,
          max: 50,
        },
      },
    ],

    totalScore: {
      type: Number,
      min: 0,
      max: 200,
      default: 0,
      required:true,
    },

  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Interview", InterviewSchema);
