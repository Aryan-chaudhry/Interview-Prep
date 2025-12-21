const ResultModel = require("../Models/resultModel");

const getResult = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("UserId:", userId);

    const result = await ResultModel
      .find({ userId })
      // .sort({ createdAt: -1 })
      // .select("totalScore confidenceLevel knowledgeLevel feedback -_id timestamps");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not available",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = getResult;
