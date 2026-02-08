const express = require("express");
const axios = require("axios");

const predictRoutes = express.Router();

// ===============================
// GET Lead Dossiers from ML Service
// GET /api/predict
// ===============================
predictRoutes.get("/", async (req, res) => {
  try {
    console.log("📡 Fetching lead intelligence from ML server");

    const response = await axios.get(
      "https://hpclscraper.onrender.com/",
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 20000 // ⏱ cold start safe
      }
    );

    const mlData = response.data;

    // ✅ Validate response is an array
    if (!Array.isArray(mlData)) {
      throw new Error("ML response is not an array");
    }

    // ✅ Normalize each lead
    const leadDossiers = mlData.map((item, index) => ({
      id: index + 1, // frontend-friendly key
      company_name: item.company_name ?? "Unknown Company",
      facility_location: item.facility_location ?? "Unknown Location",
      recommended_products: Array.isArray(item.recommended_products)
        ? item.recommended_products
        : [],
      reason_code: item.reason_code ?? "",
      urgency: item.urgency ?? "Low",
      confidence_score: Number(item.confidence_score) || 0,
      suggested_action: item.suggested_action ?? "",
      extracted_at: item.extracted_at ?? null
    }));

    console.log(`✅ ${leadDossiers.length} leads fetched`);

    res.status(200).json({
      success: true,
      count: leadDossiers.length,
      data: leadDossiers
    });

  } catch (error) {
    console.error("❌ ML lead fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead intelligence",
      error: error.message
    });
  }
});

module.exports = predictRoutes;
