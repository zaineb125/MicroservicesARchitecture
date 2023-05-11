const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { createWorker } = require("tesseract.js");
const pdf2image = require("pdf2image");
const gm = require("gm");
const app = express();
const filePath = "db.txt";
const upload = multer({ dest: "uploads/images" });
const axios = require("axios");

app.post("/commercialService", upload.single("image"), async (req, res) => {
  console.log("Pdf received and sent to OCR succesfully ");
  try {
    const imagePath = req.file.path;

    // Initialize Tesseract worker
    const worker = createWorker({
      logger: (m) => {},
    });

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    // Read text from image
    const { data } = await worker.recognize(imagePath);
    const extractedText = data.text;

    // Clean up temporary file
    fs.unlinkSync(imagePath);

    // Write extracted text to file
    fs.appendFile("output.txt", extractedText, (err) => {
      if (err) {
        console.error("An error occurred:", err);
      } else {
        console.log(
          "Text extracted successfully and written to file: output.txt"
        );
      }
    });

    return res.json({ text: extractedText });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while processing the image file");
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log("Commercial Service is running on port 3001")
);
