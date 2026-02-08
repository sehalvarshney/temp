const express = require("express");
const axios = require("axios");

const predictRoutes = express.Router();

// ===============================
// GET Lead Dossier from ML Service
// GET /api/predict
// ===============================
predictRoutes.get("/", async (req, res) => {
  try {
    console.log("📡 Fetching lead intelligence from ML server");

    const response = await axios.get(
      "https://ml-server.com/predict-lead", // 👈 your deployed ML endpoint
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const mlData = response.data;

    // Normalize & safeguard response
    const leadDossier = {
      company_name: mlData.company_name || "Unknown Company",
      facility_location: mlData.facility_location || "Unknown Location",
      recommended_product: mlData.recommended_product || [],
      reason_code: mlData.reason_code || "",
      urgency: mlData.urgency || "Low",
      confidence_score: mlData.confidence_score || 0,
      suggested_action: mlData.suggested_action || "",
      extracted_act: mlData.extracted_act || ""
    };

    res.status(200).json({
      success: true,
      data: leadDossier
    });

  } catch (error) {
    console.error("❌ ML lead fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead intelligence"
    });
  }
});

module.exports = predictRoutes;
