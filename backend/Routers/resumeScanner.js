const express = require("express");
const multer = require("multer");
const path = require("path");
// Ensure this path points to the controller below correctly
const extractPdfText = require("../Controllers/scanResume"); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the 'uploads' folder exists in your root directory!
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();
router.post("/extractpdf", upload.single("pdf"), extractPdfText);

module.exports = router;