const axios = require("axios");
const FormData = require("form-data");
const CommercialServiceController = async (req, res) => {
  let o = {
    id: req.body.id,
    score: req.body.score,
    name: req.body.name,
  };
  try {
    console.log("request sent to Risk management Service successfully ");
    let ans = await axios.post(
      "http://localhost:3002/RiskManagementStart",
      req.body
    );
  } catch (e) {
    console.log(e);
  }

  res.json({
    body: req.body,
  });
};

const RiskManagementController = async (req, res) => {
  console.log("The RiskManagement recieved the Acknowledgment successfully");
  console.log("Request sent to Credit Service successfully");

  if (req.body.finalScore >= 0.4) {
    try {
      let ans = await axios.post(
        "http://localhost:3003/CreditService",
        req.body
      );
    } catch (e) {
      console.log(e);
    }
    res.json({ body: req.body });
  } else {
    console.log("Credit request rejected");
  }
};

const uploadImageController = async (req, res) => {
  try {
    const formData = new FormData();
    console.log("Image uploaded successfully and sent to Commercial Service.");
    console.log(req.file);
    formData.append("image", req.file.buffer, req.file.originalname);
    const response = await axios.post(
      "http://localhost:3001/commercialService",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    console.log("Commercial Service Acknowledgment received successfully");
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred in upload ");
  }
};

module.exports = {
  CommercialServiceController,
  RiskManagementController,
  uploadImageController,
};
