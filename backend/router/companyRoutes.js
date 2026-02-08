const dotenv = require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db');
const router = require('./router/admin/auth');
const loginRouter = require('./router/loginRouter');
const sourceRouter = require('./router/admin/sourceRoutes');
const companyRoutes = require("./router/companyRoutes");
const predictRoutes = require("./router/predictRoutes");
const cors = require('cors');

const app = express();

// CORS Configuration - IMPORTANT
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/admin", router);
app.use("/api/auth", loginRouter);
app.use("/api/source", sourceRouter);
app.use("/api/companies", companyRoutes);
app.use("/api/predict", predictRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    endpoints: {
      companies: '/api/companies',
      test: '/api/test'
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// Connect to database
connectDb().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n✅ Server is running on port ${PORT} 🚀`);
    console.log(`📡 API Base URL: http://localhost:${PORT}`);
    console.log(`🏢 Companies API: http://localhost:${PORT}/api/companies`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Debug companies: http://localhost:${PORT}/api/companies/debug/all\n`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});