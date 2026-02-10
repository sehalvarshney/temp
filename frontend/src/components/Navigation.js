import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../css/Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: "/companies", label: "🏢 Companies", icon: "🏢" },
    { path: "/predict", label: "📊 Lead Intelligence", icon: "📊" }
  ];

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/companies" className="brand-link">
            <span className="brand-icon">🚀</span>
            <span className="brand-text">B2B CRM</span>
          </Link>
        </div>

        <div className="nav-items">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || "User"}</span>
              <span className="user-email">{user?.email || ""}</span>
            </div>
          </div>

          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
