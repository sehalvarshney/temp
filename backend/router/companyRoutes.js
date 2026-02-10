const express = require("express");
const companyRoutes = express.Router();
const Company = require("../models/Company");

// ===============================
// 1. GET All Companies
// ===============================
companyRoutes.get("/", async (req, res) => {
  try {
    console.log("📋 GET /api/companies called");
    console.log("Request headers:", req.headers);
    
    const companies = await Company.find({}).sort({ name: 1 });
    
    console.log(`✅ Found ${companies.length} companies`);
    
    // Debug: Log each company
    companies.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name} - ${company._id}`);
    });
    
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
      message: "Companies fetched successfully"
    });
    
  } catch (error) {
    console.error("❌ Error fetching companies:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// ===============================
// 2. GET Single Company by ID
// ===============================
companyRoutes.get("/:id", async (req, res) => {
  try {
    console.log("🔍 Fetching company with ID:", req.params.id);
    
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format"
      });
    }
    
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      console.log("❌ Company not found");
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    console.log("✅ Company found:", company.name);
    
    res.status(200).json({
      success: true,
      data: company
    });
    
  } catch (error) {
    console.error("❌ Error fetching company:", error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// ===============================
// 3. CREATE Company
// ===============================
companyRoutes.post("/", async (req, res) => {
  console.log("📝 POST /api/companies called");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { name, industry, website, locations, identifiers } = req.body;
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required"
      });
    }
    
    // Check if company already exists
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existingCompany = await Company.findOne({ 
      normalizedName: normalizedName
    });
    
    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company with this name already exists"
      });
    }
    
    // Process locations - ensure it's an array and clean up
    let processedLocations = [];
    if (Array.isArray(locations)) {
      processedLocations = locations
        .map(loc => loc.trim())
        .filter(loc => loc !== "");
    }
    
    // If no valid locations, set to empty array
    if (processedLocations.length === 0) {
      processedLocations = [];
    }
    
    // Create new company
    const newCompany = new Company({
      name: name.trim(),
      normalizedName: normalizedName,
      industry: (industry || '').trim(),
      website: website ? website.toLowerCase().trim() : '',
      locations: processedLocations,
      identifiers: {
        gst: (identifiers?.gst || '').trim(),
        cin: (identifiers?.cin || '').trim()
      },
      plants: [],
      signals: [],
      leads: []
    });
    
    // Save to database
    await newCompany.save();
    
    console.log("✅ Company created:", newCompany.name);
    console.log("✅ Company ID:", newCompany._id);
    
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: newCompany
    });
    
  } catch (error) {
    console.error("❌ Error in POST /api/companies:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error creating company",
      error: error.message
    });
  }
});

// ===============================
// 4. UPDATE Company
// ===============================
companyRoutes.put("/:id", async (req, res) => {
  try {
    console.log("✏️ Updating company:", req.params.id);
    
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format"
      });
    }
    
    const updates = req.body;
    
    // Handle locations array properly
    if (updates.locations && Array.isArray(updates.locations)) {
      updates.locations = updates.locations
        .map(loc => loc.trim())
        .filter(loc => loc !== "");
    }
    
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updates,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company
    });
    
  } catch (error) {
    console.error("❌ Error updating company:", error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format"
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// ===============================
// 5. DELETE Company
// ===============================
companyRoutes.delete("/:id", async (req, res) => {
  try {
    console.log("🗑️ Deleting company:", req.params.id);
    
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format"
      });
    }
    
    const company = await Company.findByIdAndDelete(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: {
        id: company._id,
        name: company.name
      }
    });
    
  } catch (error) {
    console.error("❌ Error deleting company:", error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// ===============================
// 6. SEARCH Companies
// ===============================
companyRoutes.get("/search/:term", async (req, res) => {
  try {
    const searchTerm = req.params.term;
    console.log("🔍 Searching companies for:", searchTerm);
    
    const companies = await Company.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { normalizedName: { $regex: searchTerm.toLowerCase().replace(/[^a-z0-9]/g, ''), $options: 'i' } },
        { industry: { $regex: searchTerm, $options: 'i' } },
        { website: { $regex: searchTerm, $options: 'i' } },
        { locations: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ name: 1 }).limit(50);
    
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
    
  } catch (error) {
    console.error("❌ Error searching companies:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// ===============================
// 7. DEBUG Endpoint
// ===============================
companyRoutes.get("/debug/all", async (req, res) => {
  try {
    console.log("🔍 DEBUG: Fetching all companies");
    
    const companies = await Company.find({});
    
    console.log("🔍 DEBUG: Total companies in database:", companies.length);
    companies.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name} (ID: ${company._id})`);
    });
    
    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = companyRoutes;