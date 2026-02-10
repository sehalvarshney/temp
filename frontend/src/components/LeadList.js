import React from "react";
import "../css/ml.css"; // optional, but keeps styling consistent

// Priority mapping for sorting
const urgencyRank = {
  High: 3,
  Medium: 2,
  Low: 1
};

const LeadList = ({ leads, onSelect }) => {
  // Sort leads by urgency first, then confidence score
  const sortedLeads = [...leads].sort((a, b) => {
    const urgencyDiff =
      (urgencyRank[b.urgency] || 0) - (urgencyRank[a.urgency] || 0);

    if (urgencyDiff !== 0) return urgencyDiff;

    return (b.confidence_score || 0) - (a.confidence_score || 0);
  });

  return (
    <div className="list-card">
      <h3>📋 All Lead Dossiers</h3>

      <table className="lead-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Location</th>
            <th>Urgency</th>
            <th>Confidence</th>
            <th>Products</th>
          </tr>
        </thead>

        <tbody>
          {sortedLeads.map((lead, index) => (
            <tr
              key={index}
              className="lead-row"
              onClick={() => onSelect(lead)}
            >
              <td>
                <strong>{lead.company_name}</strong>
              </td>

              <td>{lead.facility_location}</td>

              <td>
                <span
                  className={`urgency-badge ${
                    lead.urgency ? lead.urgency.toLowerCase() : "low"
                  }`}
                >
                  {lead.urgency || "Low"}
                </span>
              </td>

              <td>{lead.confidence_score}/10</td>

              <td>
                {Array.isArray(lead.recommended_products)
                  ? lead.recommended_products.slice(0, 2).join(", ")
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="hint-text">
        Click on any row to view the full lead dossier
      </p>
    </div>
  );
};

export default LeadList;
