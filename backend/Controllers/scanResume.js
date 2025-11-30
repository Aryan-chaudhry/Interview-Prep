const { PdfReader } = require("pdfreader");

const extractPdfText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const filePath = req.file.path;

    // Convert callback into Promise to wait for full PDF extraction
    const extractedText = await new Promise((resolve, reject) => {
      let text = "";

      new PdfReader().parseFileItems(filePath, (err, item) => {
        if (err) {
          return reject(err);
        }

        if (!item) {
          // PDF fully parsed -> return combined text
          return resolve(text.trim());
        }

        if (item.text) {
          text += item.text + " ";
          // console.log(text); // Optional: Comment out to reduce logs
        }
      });
    });

    // Send final extracted text to frontend
    // The key here 'extractedText' matches res.data.extractedText in frontend
    return res.status(200).json({
      success: true,
      extractedText, 
    });

  } catch (error) {
    console.error("Extract PDF Error:", error);
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

module.exports = extractPdfText;