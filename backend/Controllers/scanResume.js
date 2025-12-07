const { PdfReader } = require("pdfreader");
const fs = require("fs");

const extractPdfText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const filePath = req.file.path;

    // Convert callback to Promise
    const extractedText = await new Promise((resolve, reject) => {
      let text = "";

      new PdfReader().parseFileItems(filePath, (err, item) => {
        if (err) return reject(err);

        if (!item) {
          return resolve(text.trim());
        }

        if (item.text) {
          text += item.text + " ";
        }
      });
    });

    // ⛔ DELETE THE FILE AFTER EXTRACTION
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
      else console.log("PDF deleted:", filePath);
    });

    // Send extracted text
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
