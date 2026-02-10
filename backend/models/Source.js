const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
  },

  category: {
    type: String,
    enum: ["TENDER", "NEWS", "JOB", "OTHER"],
    required: true,
  },

  accessMethod: {
    type: String,
    enum: ["SCRAPING", "API", "MANUAL"],
    required: true,
  },

  crawlFrequency: {
    type: String,
    enum: ["DAILY", "WEEKLY", "MONTHLY"],
    default: "DAILY",
  },

  trustScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Source", sourceSchema);
