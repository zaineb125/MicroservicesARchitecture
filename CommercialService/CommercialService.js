const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { createWorker } = require("tesseract.js");
const app = express();
const upload = multer({ dest: "uploads/images" });
const axios = require("axios");

app.post("/commercialService", upload.single("image"), async (req, res) => {
  console.log("Image successfully sent to the OCR for process");
  const score = Math.random();
  try {
    const imagePath = req.file.path;

    const worker = createWorker({
      logger: (m) => {},
    });

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const { data } = await worker.recognize(imagePath);
    const extractedText = data.text;
    console.log(extractedText);

    fs.unlinkSync(imagePath);
    let accountId = Math.floor(10000 * Math.random(10000));
    let clientName = extractedText.split(":")[1].split("\n")[0];

    fs.appendFile("extractedText.txt", extractedText, (err) => {
      if (err) {
        console.error("An error occurred:", err);
      } else {
        console.log(
          "Text extracted from image  and added to the file: extractedText.txt"
        );
      }
    });
    let returnedData = axios.post(
      "http://localhost:3000/CommercialServiceFinish",
      {
        accountId,
        score,
        clientName,
        decision: score >= 0.5 ? "accepted" : "rejected",
      }
    );
    console.log("Acknowledgment sent successfull to CenteralService");
    return res.json({
      accountId,
      clientName,
      decision: score >= 0.5 ? "accepted" : "rejected",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in processing image ");
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log("Commercial Service is running on port 3001")
);
