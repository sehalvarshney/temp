const mongoose = require("mongoose");

const IdentifierSchema = new mongoose.Schema(
  {
    gst: {
      type: String,
      trim: true,
      default: ""
    },
    cin: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false }
);

const CompanySchema = new mongoose.Schema(
  {
    // ===============================
    // Core Identity
    // ===============================
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },

    normalizedName: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    industry: {
      type: String,
      trim: true,
      default: ""
    },

    website: {
      type: String,
      trim: true,
      lowercase: true,
      default: ""
    },

    // ===============================
    // Locations & Identifiers
    // ===============================
    locations: {
      type: [String],
      default: []
    },

    identifiers: {
      type: IdentifierSchema,
      default: () => ({})
    },

    // ===============================
    // Future Expansion Buckets
    // ===============================
    plants: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },

    signals: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },

    leads: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// ===============================
// Indexes
// ===============================
CompanySchema.index({ name: "text", industry: "text", website: "text" });

// ===============================
// Export Model
// ===============================
module.exports = mongoose.model("Company", CompanySchema);
