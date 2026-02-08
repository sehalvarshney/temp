import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import Components
import Login from './components/Login';
import CompanyManagement from './components/CompanyManagement';
import CompanyCard from './components/CompanyCard';
import MLPredict from './components/MLPredict';
import Navigation from './components/Navigation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', 'mock-jwt-token'); // In real app, store actual JWT
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
        
        <div className="container">
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/companies" />
              } 
            />
            <Route path="/companies" element={<CompanyManagement />} />
           <Route path="/companies/:id" element={<CompanyCard />} />
            <Route 
              path="/predict" 
              element={
                isAuthenticated ? 
                <MLPredict /> : 
                <Navigate to="/login" />
              } 
            />
            <Route 
              path="/" 
              element={
                <Navigate to={isAuthenticated ? "/companies" : "/login"} />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;