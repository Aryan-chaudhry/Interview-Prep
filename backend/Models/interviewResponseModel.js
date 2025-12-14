const mongoose = require('mongoose');

const InterviewResponseSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: 'User', required: true },
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
    answers: [
      {
        question: { type: String, required: true },
        category: { type: String },
        answerText: { type: String },
        code: { type: String },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewResponse', InterviewResponseSchema);
