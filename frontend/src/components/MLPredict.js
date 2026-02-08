import React, { useEffect, useState } from "react";
import api from "../api/axios";
import LeadList from "./LeadList";
import "../css/ml.css";

const MLPredict = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    setSelectedLead(null);

    try {
      const response = await api.get("http://localhost:5000/api/predict");

      if (response.data.success) {
        setLeads(response.data.data);
      } else {
        setError("Failed to load leads");
      }
    } catch (err) {
      setError("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="ml-predict-container">
      <div className="header-section">
        <h1>🏭 Lead Intelligence</h1>
        <p>Prioritized B2B opportunities detected by AI</p>

        <button className="predict-btn" onClick={fetchLeads} disabled={loading}>
          🔄 Refresh Intelligence
        </button>
      </div>

      {loading && <p>Loading leads...</p>}
      {error && <div className="error-message">{error}</div>}

      {!loading && leads.length > 0 && (
        <>
          {/* LIST VIEW */}
          <LeadList leads={leads} onSelect={setSelectedLead} />

          {/* DETAIL VIEW */}
          {selectedLead && (
            <div className="result-card">
              <h3>📊 Company Intelligence Report</h3>

              <p><strong>Company:</strong> {selectedLead.company_name}</p>
              <p><strong>Location:</strong> {selectedLead.facility_location}</p>

              <p><strong>Urgency:</strong> {selectedLead.urgency}</p>
              <p><strong>Confidence:</strong> {selectedLead.confidence_score}/10</p>

              <p><strong>Reason:</strong> {selectedLead.reason_code}</p>

              <p><strong>Recommended Products:</strong></p>
              <ul>
                {selectedLead.recommended_products.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>

              <p><strong>Suggested Action:</strong></p>
              <p>{selectedLead.suggested_action}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MLPredict;
