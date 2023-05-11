const express = require("express");
const fs = require("fs");
const app = express();
const filePath = "../db.txt";
const axios = require("axios");
app.use(express.json());

app.post("/RiskManagementStart", async (req, res) => {
  console.log("Calculation of final score is done successfully! ");
  console.log("Client notified successfully");
  console.log(req.body);
  let accountId = req.body.accountId;
  let score = req.body.score;
  let clientName = req.body.clientName;
  let decision = req.body.decision;
  // Simulating the central bank api with a random number to get the final score
  let finalScore = req.body.score * (Math.random() + 0.7);

  req.body.finalScore = finalScore;

  try {
    let ans = axios.post(
      "http://localhost:3000/RiskManagementFinish",
      req.body
    );
  } catch (e) {
    console.log(e);
  }
  console.log("Acknowledgment sent successfull to CentralService");

  values = [accountId, clientName, score, finalScore, decision];

  fs.appendFile(filePath, "\n" + values.join(","), (err) => {
    if (err) {
      console.error("An error occurred:", err);
    } else {
      console.log(`Values written to file: ${filePath}`);
    }
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log("Risk Management Service app is running on port 3002");
});
