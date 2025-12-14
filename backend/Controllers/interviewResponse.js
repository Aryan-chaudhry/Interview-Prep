const InterviewResponse = require('../Models/interviewResponseModel');

const saveAnswers = async (req, res) => {
  try {
    const { userId, interviewId, answers } = req.body;

    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const doc = new InterviewResponse({ userId, interviewId, answers });
    await doc.save();

    return res.status(201).json({ message: 'Answers saved', response: doc });
  } catch (error) {
    console.error('Error saving answers:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { saveAnswers };
