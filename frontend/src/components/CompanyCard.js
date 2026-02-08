import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/company.css';
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CompanyCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log("📱 CompanyCard mounted with ID:", id);
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      setError('');
      setDebugInfo('Fetching company details...');
      
      const response = await axios.get(`${API}/api/companies/${id}`, {
        timeout: 10000
      });
      
      console.log("✅ API Response:", response.data);
      
      if (response.data.success) {
        setCompany(response.data.data);
        setDebugInfo(`Loaded: ${response.data.data.name}`);
      } else {
        throw new Error(response.data.message || 'Failed to load company');
      }
      
    } catch (err) {
      console.error('❌ Fetch error:', err);
      
      let errorMsg = 'Failed to load company details. ';
      
      if (err.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout. Please check if backend is running.';
      } else if (err.response?.status === 404) {
        errorMsg = 'Company not found.';
      } else if (err.response?.status === 400) {
        errorMsg = 'Invalid company ID format.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Backend server error.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg += err.message;
      }
      
      setError(errorMsg);
      setDebugInfo('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log("🔄 Refreshing...");
    fetchCompanyDetails();
  };

  const handleEdit = () => {
    console.log("✏️ Editing company...");
    navigate(`/companies/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        setLoading(true);
        await axios.delete(`${API}/api/companies/${id}`);
        alert('Company deleted successfully!');
        navigate('/companies');
      } catch (err) {
        alert('Failed to delete company: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    }
  };

  // Loading state
  if (loading && !company) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading company details...</p>
        <p style={styles.debugText}>ID: {id}</p>
        <p style={styles.debugText}>{debugInfo}</p>
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => navigate('/companies')} 
            style={styles.primaryButton}
          >
            ← Back to Companies
          </button>
          
          <button 
            onClick={handleRefresh}
            style={styles.successButton}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !company) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorTitle}>⚠️ Error Loading Company</h2>
        <p style={styles.errorMessage}>{error}</p>
        <p style={styles.debugText}>{debugInfo}</p>
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => navigate('/companies')} 
            style={styles.primaryButton}
          >
            ← Back to Companies
          </button>
          
          <button 
            onClick={handleRefresh}
            style={styles.successButton}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button 
            onClick={() => navigate('/companies')} 
            style={styles.backButton}
          >
            ← Back to List
          </button>
          
          <div style={styles.headerActions}>
            <button 
              onClick={handleRefresh}
              style={styles.actionButton}
              disabled={loading}
            >
              🔄 Refresh
            </button>
            
            <button 
              onClick={handleEdit}
              style={styles.editButton}
            >
              ✏️ Edit Company
            </button>
            
            <button 
              onClick={handleDelete}
              style={styles.deleteButton}
              disabled={loading}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
        
        <div style={styles.headerMain}>
          <h1 style={styles.companyName}>{company?.name || 'Unknown Company'}</h1>
          <span style={styles.industryBadge}>
            {company?.industry || 'Industry not specified'}
          </span>
        </div>
        
        {/* Debug info */}
        {debugInfo && (
          <div style={styles.debugInfo}>
            Debug: {debugInfo}
          </div>
        )}
      </div>

      <div style={styles.content}>
        {/* Left Column - Company Info */}
        <div style={styles.leftColumn}>
          {/* Basic Information */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Company Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Company ID</label>
                <p style={styles.monospaceText}>{company?._id || 'N/A'}</p>
              </div>
              
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Industry</label>
                <p>{company?.industry || 'Not specified'}</p>
              </div>
              
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Website</label>
                <p>
                  {company?.website ? (
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.link}
                    >
                      {company.website}
                    </a>
                  ) : 'Not specified'}
                </p>
              </div>
              
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Created</label>
                <p>{company?.createdAt ? new Date(company.createdAt).toLocaleString() : 'Unknown'}</p>
              </div>
              
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Last Updated</label>
                <p>{company?.updatedAt ? new Date(company.updatedAt).toLocaleString() : 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Identifiers */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🔖 Legal Identifiers</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>GST Number</label>
                <p style={styles.monospaceText}>{company?.identifiers?.gst || 'Not specified'}</p>
              </div>
              
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>CIN Number</label>
                <p style={styles.monospaceText}>{company?.identifiers?.cin || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📍 Locations</h3>
            {company?.locations && company.locations.length > 0 ? (
              <div style={styles.locationsList}>
                {company.locations.map((location, index) => (
                  <div key={index} style={styles.locationItem}>
                    📍 {location || `Location ${index + 1}`}
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noDataText}>No locations specified</p>
            )}
          </div>
        </div>

        {/* Right Column - Related Data */}
        <div style={styles.rightColumn}>
          {/* Plants */}
          <div style={styles.sidebarCard}>
            <h4 style={styles.sidebarTitle}>🏭 Plants & Facilities</h4>
            {company?.plants && company.plants.length > 0 ? (
              <div style={styles.plantsList}>
                {company.plants.map((plant, index) => (
                  <div key={index} style={styles.plantItem}>
                    <strong style={styles.plantName}>{plant.name || `Plant ${index + 1}`}</strong>
                    <span style={styles.plantType}>{plant.type || 'Type not specified'}</span>
                    <small style={styles.plantLocation}>{plant.location || 'Location not specified'}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noDataText}>No plants registered</p>
            )}
          </div>

          {/* Signals */}
          <div style={styles.sidebarCard}>
            <h4 style={styles.sidebarTitle}>📈 Market Signals</h4>
            {company?.signals && company.signals.length > 0 ? (
              <div style={styles.signalsList}>
                {company.signals.map((signal, index) => (
                  <div key={index} style={styles.signalItem}>
                    <div style={styles.signalHeader}>
                      <span style={styles.signalType}>{signal.type || 'Signal'}</span>
                      <span style={styles.signalDate}>
                        {signal.date ? new Date(signal.date).toLocaleDateString() : 'Date not specified'}
                      </span>
                    </div>
                    <p style={styles.signalDescription}>{signal.description || 'No description'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noDataText}>No signals recorded</p>
            )}
          </div>

          {/* Leads */}
          <div style={styles.sidebarCard}>
            <h4 style={styles.sidebarTitle}>👥 Associated Leads</h4>
            {company?.leads && company.leads.length > 0 ? (
              <div style={styles.leadsList}>
                {company.leads.map((lead, index) => (
                  <div key={index} style={styles.leadItem}>
                    <div style={styles.leadAvatar}>
                      {typeof lead === 'string' ? lead.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div style={styles.leadInfo}>
                      <strong style={styles.leadName}>
                        {typeof lead === 'string' ? lead : 'Unknown Lead'}
                      </strong>
                      <span style={styles.leadTitle}>Contact</span>
                    </div>
                    <span style={styles.leadStatus}>Active</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noDataText}>No leads associated</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  
  // Loading
  loadingContainer: {
    textAlign: 'center',
    padding: '40px',
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    marginBottom: '10px',
    color: '#666'
  },
  debugText: {
    fontSize: '12px',
    color: '#999'
  },
  
  // Error
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorTitle: {
    color: '#e74c3c',
    marginBottom: '20px'
  },
  errorMessage: {
    color: '#666',
    margin: '20px 0',
    maxWidth: '500px'
  },
  
  // Header
  header: {
    marginBottom: '30px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '20px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  headerMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  companyName: {
    margin: 0,
    fontSize: '32px',
    color: '#2c3e50'
  },
  industryBadge: {
    backgroundColor: '#e8f4fc',
    color: '#3498db',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  
  // Buttons
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  successButton: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  warningButton: {
    padding: '10px 20px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  
  // Content
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '30px'
  },
  
  // Cards
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sidebarCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    marginTop: 0,
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  sidebarTitle: {
    marginTop: 0,
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  
  // Info Grid
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  infoItem: {
    marginBottom: '10px'
  },
  infoLabel: {
    display: 'block',
    fontWeight: 'bold',
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '5px'
  },
  
  // Text
  monospaceText: {
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: '8px',
    borderRadius: '4px',
    margin: 0,
    fontSize: '14px',
    wordBreak: 'break-all'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none'
  },
  noDataText: {
    color: '#95a5a6',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px 0'
  },
  
  // Lists
  locationsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px'
  },
  locationItem: {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '4px',
    borderLeft: '3px solid #3498db'
  },
  plantsList: {
    marginTop: '15px'
  },
  plantItem: {
    borderBottom: '1px solid #eee',
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  plantName: {
    color: '#2c3e50'
  },
  plantType: {
    fontSize: '14px',
    color: '#7f8c8d'
  },
  plantLocation: {
    fontSize: '12px',
    color: '#95a5a6'
  },
  signalsList: {
    marginTop: '15px'
  },
  signalItem: {
    borderBottom: '1px solid #eee',
    padding: '10px 0'
  },
  signalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  signalType: {
    backgroundColor: '#e8f4fc',
    color: '#3498db',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  signalDate: {
    fontSize: '12px',
    color: '#95a5a6'
  },
  signalDescription: {
    margin: 0,
    fontSize: '14px',
    color: '#2c3e50'
  },
  leadsList: {
    marginTop: '15px'
  },
  leadItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    gap: '10px'
  },
  leadAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  leadInfo: {
    flex: 1
  },
  leadName: {
    display: 'block',
    color: '#2c3e50'
  },
  leadTitle: {
    fontSize: '12px',
    color: '#7f8c8d'
  },
  leadStatus: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '12px',
    backgroundColor: '#e8f4fc',
    color: '#3498db',
    fontWeight: 'bold'
  },
  
  // Misc
  debugInfo: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#666'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column'
  }
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
}

export default CompanyCard;