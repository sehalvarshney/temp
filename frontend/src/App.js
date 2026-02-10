import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Components
import Login from "./components/Login";
import CompanyManagement from "./components/CompanyManagement";
import CompanyCard from "./components/CompanyCard";
import MLPredict from "./components/MLPredict"; // Lead Intelligence page
import Navigation from "./components/Navigation";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("token", "mock-jwt-token");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <Navigation user={user} onLogout={handleLogout} />
        )}

        <div className="container">
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/companies" />
                )
              }
            />

            {/* ================= PROTECTED ROUTES ================= */}
            <Route
              path="/companies"
              element={
                isAuthenticated ? (
                  <CompanyManagement />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/companies/:id"
              element={
                isAuthenticated ? (
                  <CompanyCard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/predict"
              element={
                isAuthenticated ? (
                  <MLPredict />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* ================= FALLBACK ================= */}
            <Route
              path="*"
              element={<Navigate to="/" />}
            />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
