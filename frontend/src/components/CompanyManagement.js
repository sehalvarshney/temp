import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import '../css/company.css';

// Backend URL - Should be in environment variable
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
console.log("🌐 Frontend using API URL:", API);

const CompanyManagement = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    locations: [""],
    identifiers: {
      gst: "",
      cin: ""
    }
  });

  // =============================
  // Fetch Companies
  // =============================
  useEffect(() => {
    console.log("🔍 CompanyManagement mounted, fetching companies...");
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching companies from:", `${API}/api/companies`);
      
      const response = await api.get(`${API}/api/companies`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log("✅ GET Response received:", response.data);
      console.log("✅ Response structure:", {
        success: response.data.success,
        count: response.data.count,
        hasData: !!response.data.data,
        dataLength: response.data.data?.length || 0
      });
      
      if (response.data.success) {
        const companiesData = response.data.data || [];
        console.log(`📊 Setting ${companiesData.length} companies to state`);
        setCompanies(companiesData);
        setMessage(companiesData.length === 0 ? "No companies found. Create your first company!" : "");
      } else {
        console.error("❌ API returned success:false", response.data);
        setMessage(response.data.message || "Failed to load companies");
        setCompanies([]);
      }
    } catch (error) {
      console.error("❌ Fetch Error Details:");
      console.error("- Error message:", error.message);
      console.error("- Error code:", error.code);
      console.error("- Response status:", error.response?.status);
      console.error("- Response data:", error.response?.data);
      console.error("- Request URL:", error.config?.url);
      
      let errorMsg = "Failed to load companies. ";
      
      if (error.code === 'ECONNABORTED') {
        errorMsg = "Request timeout. Check if backend is running at " + API;
      } else if (error.response?.status === 404) {
        errorMsg = "API endpoint not found. Check backend routes.";
      } else if (error.response?.status === 500) {
        errorMsg = "Backend server error. Check backend logs.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message?.includes('Network Error')) {
        errorMsg = "Network error. Make sure backend is running on " + API;
      }
      
      setMessage(errorMsg);
      setCompanies([]);
      
      // Try debug endpoint
      try {
        console.log("🔄 Trying debug endpoint...");
        const debugResponse = await api.get(`${API}/api/companies/debug/all`);
        console.log("Debug endpoint response:", debugResponse.data);
      } catch (debugError) {
        console.error("Debug endpoint also failed:", debugError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Handle Change
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested identifiers
    if (name.startsWith("identifiers.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        identifiers: {
          ...prev.identifiers,
          [field]: value
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // =============================
  // Locations Management
  // =============================
  const handleLocationChange = (index, value) => {
    const updated = [...formData.locations];
    updated[index] = value;
    setFormData(prev => ({
      ...prev,
      locations: updated
    }));
  };

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, ""]
    }));
  };

  const removeLocation = (index) => {
    if (formData.locations.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  // =============================
  // Submit Form
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Form submitted");
    
    // Validation
    if (!formData.name.trim()) {
      setMessage("Company name is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Clean up empty locations before sending
      const cleanedLocations = formData.locations
        .map(loc => loc.trim())
        .filter(loc => loc !== "");
      
      const payload = {
        ...formData,
        locations: cleanedLocations.length > 0 ? cleanedLocations : []
      };

      console.log("📤 Sending payload:", payload);
      console.log("📤 Sending to URL:", `${API}/api/companies`);

      const response = await api.post(
        `${API}/api/companies`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000
        }
      );

      console.log("✅ Backend response:", response.data);

      if (response.data.success) {
        const successMsg = `✅ Company "${response.data.data.name}" created successfully!`;
        console.log(successMsg);
        setMessage(successMsg);
        resetForm();
        
        // Wait 1 second then refresh the list
        setTimeout(() => {
          console.log("🔄 Refreshing company list...");
          fetchCompanies();
        }, 1000);
      } else {
        const errorMsg = `❌ API Error: ${response.data.message || "Unknown error"}`;
        console.error(errorMsg);
        setMessage(errorMsg);
      }
      
    } catch (error) {
      console.error("❌ Submit Error Details:");
      console.error("- Error:", error.message);
      console.error("- Status:", error.response?.status);
      console.error("- Response data:", error.response?.data);
      console.error("- Request config:", error.config);
      
      let errorMsg = "❌ Error saving company. ";
      
      if (error.code === 'ECONNABORTED') {
        errorMsg = "⏱️ Request timeout. Backend might be down or slow.";
      } else if (error.response?.status === 409) {
        errorMsg = "⚠️ Company with this name already exists.";
      } else if (error.response?.status === 400) {
        errorMsg = `⚠️ Validation error: ${error.response.data.message || "Check your data"}`;
      } else if (error.response?.data?.message) {
        errorMsg = `⚠️ ${error.response.data.message}`;
      } else if (error.message?.includes('Network Error')) {
        errorMsg = "🌐 Network error. Check if backend is running.";
      }
      
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Reset Form
  // =============================
  const resetForm = () => {
    setFormData({
      name: "",
      industry: "",
      website: "",
      locations: [""],
      identifiers: {
        gst: "",
        cin: ""
      }
    });
  };

  // =============================
  // Search Filter
  // =============================
  const filteredCompanies = companies.filter(company => {
    if (!company || typeof company !== 'object') return false;
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (company.name || "").toLowerCase().includes(searchLower) ||
      (company.industry || "").toLowerCase().includes(searchLower) ||
      (company.website || "").toLowerCase().includes(searchLower) ||
      (Array.isArray(company.locations) && 
       company.locations.some(loc => 
         (loc || "").toLowerCase().includes(searchLower)
       ))
    );
  });

  // =============================
  // Test API Connection
  // =============================
  const testConnection = async () => {
    try {
      setLoading(true);
      console.log("🧪 Testing API connection to:", API);
      
      const response = await api.get(`${API}/api/test`, { timeout: 5000 });
      console.log("✅ Connection test successful:", response.data);
      setMessage(`✅ Backend is working: ${response.data.message}`);
      
      // Also fetch companies
      await fetchCompanies();
    } catch (error) {
      console.error("❌ Connection test failed:", error.message);
      setMessage(`❌ Cannot connect to backend at ${API}`);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Render
  // =============================
  return (
    <div className="company-management" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>🏢 Company Management</h1>

      {/* Connection Test Button */}
      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={testConnection}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          🧪 Test Backend Connection
        </button>
        
        <button 
          onClick={() => console.log("Companies state:", companies)}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          🔍 Log State
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div style={{
          padding: "15px",
          marginBottom: "20px",
          backgroundColor: message.includes("✅") || message.includes("successfully") ? "#d4edda" : 
                         message.includes("⚠️") ? "#fff3cd" : "#f8d7da",
          border: `1px solid ${message.includes("✅") || message.includes("successfully") ? "#c3e6cb" : 
                  message.includes("⚠️") ? "#ffeaa7" : "#f5c6cb"}`,
          borderRadius: "4px",
          color: message.includes("✅") || message.includes("successfully") ? "#155724" : 
                message.includes("⚠️") ? "#856404" : "#721c24"
        }}>
          <strong>{message.includes("✅") ? "✅ " : message.includes("⚠️") ? "⚠️ " : "❌ "}</strong>
          {message}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ 
        marginBottom: "30px", 
        padding: "25px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px",
        border: "1px solid #e9ecef"
      }}>
        <h3 style={{ marginTop: 0, color: "#495057" }}>➕ Add New Company</h3>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#495057" }}>
            Company Name *
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter company name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ 
              width: "100%", 
              maxWidth: "400px", 
              padding: "10px", 
              border: "1px solid #ced4da", 
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#495057" }}>
            Industry
          </label>
          <input
            type="text"
            name="industry"
            placeholder="Enter industry"
            value={formData.industry}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              maxWidth: "400px", 
              padding: "10px", 
              border: "1px solid #ced4da", 
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#495057" }}>
            Website
          </label>
          <input
            type="url"
            name="website"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              maxWidth: "400px", 
              padding: "10px", 
              border: "1px solid #ced4da", 
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#495057" }}>
            GST Number
          </label>
          <input
            type="text"
            name="identifiers.gst"
            placeholder="Enter GST number"
            value={formData.identifiers.gst}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              maxWidth: "400px", 
              padding: "10px", 
              border: "1px solid #ced4da", 
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#495057" }}>
            CIN Number
          </label>
          <input
            type="text"
            name="identifiers.cin"
            placeholder="Enter CIN number"
            value={formData.identifiers.cin}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              maxWidth: "400px", 
              padding: "10px", 
              border: "1px solid #ced4da", 
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        {/* LOCATIONS */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold", color: "#495057" }}>
            Locations
          </label>
          {formData.locations.map((loc, index) => (
            <div key={index} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="text"
                value={loc}
                placeholder={`Location ${index + 1}`}
                onChange={(e) => handleLocationChange(index, e.target.value)}
                style={{ 
                  flex: 1, 
                  maxWidth: "350px", 
                  padding: "10px", 
                  border: "1px solid #ced4da", 
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
              {formData.locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  style={{ 
                    padding: "10px 15px", 
                    backgroundColor: "#dc3545", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addLocation}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "10px"
            }}
          >
            ➕ Add Location
          </button>
        </div>

        <div style={{ marginTop: "25px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: loading ? "#adb5bd" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {loading ? "⏳ Saving..." : "💾 Save Company"}
          </button>
          
          <button 
            type="button" 
            onClick={resetForm}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            🗑️ Clear Form
          </button>
          
          <button 
            type="button" 
            onClick={fetchCompanies}
            disabled={loading}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            🔄 Refresh List
          </button>
        </div>
      </form>

      <hr style={{ margin: "30px 0", border: "none", borderTop: "1px solid #dee2e6" }} />

      {/* SEARCH AND LIST */}
      <div style={{ marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="🔍 Search companies by name, industry, website, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: "100%", 
            maxWidth: "500px", 
            padding: "12px",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      <h2 style={{ color: "#495057", marginBottom: "20px" }}>
        📋 Company List ({filteredCompanies.length})
        {loading && <span style={{ fontSize: "14px", color: "#6c757d", marginLeft: "10px" }}>Loading...</span>}
      </h2>

      {/* COMPANY LIST */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ 
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 25px"
          }}></div>
          <p style={{ color: "#6c757d", fontSize: "18px" }}>Loading companies...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px", 
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef"
        }}>
          <p style={{ fontSize: "18px", marginBottom: "15px", color: "#6c757d" }}>
            {companies.length === 0 
              ? "📭 No companies found. Create your first company!" 
              : searchTerm 
                ? "🔍 No companies match your search." 
                : "📭 No companies found."}
          </p>
          {companies.length === 0 && !searchTerm && (
            <button 
              onClick={resetForm}
              style={{ 
                padding: "12px 24px", 
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              ➕ Create Your First Company
            </button>
          )}
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: "25px" 
        }}>
          {filteredCompanies.map(company => (
            <div
              key={company._id}
              style={{
                border: "1px solid #e9ecef",
                padding: "25px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
              onClick={() => navigate(`/companies/${company._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = "#007bff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#e9ecef";
              }}
            >
              <h3 style={{ 
                marginTop: 0, 
                color: "#007bff", 
                marginBottom: "15px",
                fontSize: "20px"
              }}>
                {company.name}
              </h3>
              
              {company.industry && (
                <p style={{ margin: "8px 0", fontSize: "15px" }}>
                  <strong style={{ color: "#495057" }}>🏭 Industry:</strong> 
                  <span style={{ marginLeft: "8px", color: "#6c757d" }}>{company.industry}</span>
                </p>
              )}
              
              {company.website && (
                <p style={{ margin: "8px 0", fontSize: "15px" }}>
                  <strong style={{ color: "#495057" }}>🌐 Website:</strong> 
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: "#007bff", 
                      marginLeft: "8px",
                      textDecoration: "none"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {company.website}
                  </a>
                </p>
              )}
              
              {company.identifiers?.gst && (
                <p style={{ margin: "8px 0", fontSize: "15px" }}>
                  <strong style={{ color: "#495057" }}>🔖 GST:</strong> 
                  <span style={{ marginLeft: "8px", color: "#6c757d", fontFamily: "monospace" }}>
                    {company.identifiers.gst}
                  </span>
                </p>
              )}
              
              {company.locations && company.locations.length > 0 && (
                <p style={{ margin: "8px 0", fontSize: "15px" }}>
                  <strong style={{ color: "#495057" }}>📍 Locations:</strong> 
                  <span style={{ marginLeft: "8px", color: "#6c757d" }}>
                    {company.locations.join(", ")}
                  </span>
                </p>
              )}
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginTop: "20px",
                paddingTop: "15px",
                borderTop: "1px solid #e9ecef"
              }}>
                <small style={{ color: "#6c757d", fontSize: "13px" }}>
                  👆 Click to view details →
                </small>
                <span style={{ fontSize: "12px", color: "#adb5bd" }}>
                  {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Debug info - always show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          marginTop: "40px", 
          padding: "20px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px", 
          fontSize: "13px",
          border: "1px solid #e9ecef"
        }}>
          <h4 style={{ marginTop: 0, color: "#495057" }}>🛠️ Debug Information</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
            <div><strong>🌐 API URL:</strong> {API}</div>
            <div><strong>📊 Total companies:</strong> {companies.length}</div>
            <div><strong>🔍 Filtered:</strong> {filteredCompanies.length}</div>
            <div><strong>⏳ Loading:</strong> {loading.toString()}</div>
            <div><strong>📝 Message:</strong> {message.substring(0, 50)}...</div>
            <div><strong>🔎 Search term:</strong> "{searchTerm}"</div>
          </div>
          <button 
            onClick={() => console.log("Full companies data:", companies)}
            style={{ 
              marginTop: "10px",
              padding: "5px 10px", 
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Log Full Data to Console
          </button>
        </div>
      )}
    </div>
  );
};

// Add CSS for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default CompanyManagement;