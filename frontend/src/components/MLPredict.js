import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ml.css"; // Add this import

const MLPredict = () => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchCount, setFetchCount] = useState(0);

  const fetchLead = async () => {
    setLoading(true);
    setError("");
    setLead(null); // Clear previous lead for animation

    try {
      const response = await axios.get("/api/predict");

      if (response.data.success) {
        setLead(response.data.data);
        setFetchCount(prev => prev + 1);
      } else {
        setError("Failed to load lead dossier");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, []);

  return (
    <div className="ml-predict-container">
      {/* Floating elements for background */}
      <div className="floating-element floating-1"></div>
      <div className="floating-element floating-2"></div>

      {/* Header Section */}
      <div className="header-section">
        <h1>🏭 Lead Intelligence Dossier</h1>
        <p>AI-powered B2B opportunity discovery and recommendation engine</p>

        <button className="predict-btn" onClick={fetchLead} disabled={loading}>
          {loading ? "🔄 Analyzing..." : "🔄 Refresh Intelligence"}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="ai-loader"></div>
          <p>AI scanning business landscape for opportunities</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Results */}
      {lead && !loading && (
        <div className={`result-card ${fetchCount > 1 ? 'new-lead' : ''}`}>
          {/* Company Details */}
          <h3>📊 Company Intelligence Report</h3>
          
          <div className="lead-details">
            <div className="detail-item">
              <strong>Company</strong>
              <p>{lead.company_name}</p>
            </div>
            
            <div className="detail-item">
              <strong>Facility Location</strong>
              <p>{lead.facility_location}</p>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="products-section">
            <strong>✨ Recommended Products</strong>
            <div className="product-tags">
              {lead.recommended_product.map((p, i) => (
                <div key={i} className="product-tag">
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Confidence Score</span>
              <span className="metric-value confidence">
                {(lead.confidence_score * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="metric-card">
              <span className="metric-label">Urgency Level</span>
              <span className="metric-value urgency">
                {lead.urgency}
              </span>
            </div>
            
            <div className="metric-card">
              <span className="metric-label">Reason Code</span>
              <span className="metric-value">
                {lead.reason_code}
              </span>
            </div>
          </div>

          {/* Suggested Action */}
          <div className="action-section">
            <strong>🚀 Suggested Action</strong>
            <p>{lead.suggested_action}</p>
          </div>

          {/* Extracted Signal */}
          <div className="signal-section">
            <strong>📡 Extracted Market Signal</strong>
            <pre className="signal-pre">{lead.extracted_act}</pre>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
            <p>📈 AI Model updated: Just now • Refresh for latest intelligence</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLPredict;