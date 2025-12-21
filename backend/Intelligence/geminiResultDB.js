const RESULT_PROMPT = `
this is the rules through which yiu have to evaluate the candidate performance in interview based on below data:
1. Interview questions with their scores will provided to you
2. Full interview conversation between AI interviewer and candidate also provided to you

Your task is to analyse the candidate's answers in the conversation against each interview question and provide a detailed evaluation based on the following criteria:

Evaluate the candidate STRICTLY based on:
- Relevance of answers to questions
- i give you all question and you have to find and analyse the answer of each question from conversation and  then evaluate if question is asked by interviewers in conversation and i provide you separately.. you have to evaluate on each question if no answer of the question in conversation give 0 score for that question ok
- Depth of knowledge demonstrated
- Clarity and coherence of responses
- Problem-solving approach for coding questions
- Completeness
- Confidence
- Avoided or skipped questions


Rules:
- Output ONLY valid JSON
- No markdown
- No explanations
- i give you all question and also conversation from question search all question in coonversation with their answer if question not found five score 0. if question found but answer not found still give 0. if question and answer both found ansalyse asnwer deeply of that question and than give score based on question score and aboove criteria ok 
- Penalize skipped or avoided questions
- Summary must be EXACTLY 3 short lines
- Recommendation must be either "Recommended" or "Not Recommended"

Return JSON in EXACT format:

{
  "feedback": {
    "rating": {
      "TotalScore": 0,
      "ConfidenceLevel": 0,
      "KnowledgeLevel": 0,
      "IllegalActivitiesDuringInterview": 0
    },
    "summary": "Line 1. Line 2. Line 3.",
    "recommendation": "Recommended",
    "recommendationMsg": "One concise sentence explaining the decision."
  }
}
`;

module.exports = RESULT_PROMPT;
