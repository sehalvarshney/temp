const express = require("express");
const sourceRouter = express.Router();

const Source = require("../../models/Source");


// ===============================
// 1️⃣ Register Source (ADMIN)
// POST /api/sources
// ===============================
sourceRouter.post("/", async (req, res) => {
  try {
    const {
      domain,
      category,
      accessMethod,
      crawlFrequency,
      trustScore,
    } = req.body;

    // Check if already exists
    const existing = await Source.findOne({ domain });

    if (existing) {
      return res.status(400).json({
        message: "Source already exists",
      });
    }

    const source = new Source({
      domain,
      category,
      accessMethod,
      crawlFrequency,
      trustScore,
    });

    await source.save();

    res.status(201).json({
      message: "Source registered successfully",
      data: source,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ===============================
// 2️⃣ List All Sources
// GET /api/sources
// ===============================
sourceRouter.get("/", async (req, res) => {
  try {
    const sources = await Source.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: sources.length,
      data: sources,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ===============================
// 3️⃣ Get Single Source (Optional)
// GET /api/sources/:id
// ===============================
sourceRouter.get("/:id", async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);

    if (!source) {
      return res.status(404).json({
        message: "Source not found",
      });
    }

    res.status(200).json(source);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// 4️⃣ Update Source (Optional)
// PUT /api/sources/:id
// ===============================
sourceRouter.put("/:id", async (req, res) => {
  try {
    const updated = await Source.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Source not found",
      });
    }

    res.status(200).json({
      message: "Source updated",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// 5️⃣ Delete Source (Optional)
// DELETE /api/sources/:id
// ===============================
sourceRouter.delete("/:id", async (req, res) => {
  try {
    const deleted = await Source.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Source not found",
      });
    }

    res.status(200).json({
      message: "Source deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = sourceRouter;
