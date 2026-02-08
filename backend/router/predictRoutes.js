const express = require("express");
const axios = require("axios");

const predictRoutes = express.Router();


// ===============================
// Call ML Model
// POST /api/predict
// ===============================
predictRoutes.post("/", async (req, res) => {

  try {

    const { input } = req.body;


    // Call ML API
    const response = await axios.post(
      "https://ml-server.com/predict", // MODEL LINK
      {
        text: input
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );


    // ML Output
    const prediction = response.data;


    // Send to frontend
    res.status(200).json({
      success: true,
      prediction
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Prediction failed"
    });

  }

});


module.exports = predictRoutes;
