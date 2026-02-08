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

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Add all your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/admin", router);
app.use("/api/auth", loginRouter);
app.use("/api/source", sourceRouter);
app.use("/api/companies", companyRoutes);
app.use("/api/predict", predictRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'OK',
    mongodb: statusMap[dbStatus] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      companies: '/api/companies',
      health: '/api/health'
    }
  });
});

// Simple root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Company Management API',
    endpoints: {
      companies: '/api/companies',
      health: '/api/health',
      test: '/api/test'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDb();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🎉 ==========================================`);
      console.log(`✅ Server is running on port ${PORT} 🚀`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}`);
      console.log(`\n📋 Available endpoints:`);
      console.log(`   🏢 Companies: http://localhost:${PORT}/api/companies`);
      console.log(`   🧪 Test: http://localhost:${PORT}/api/test`);
      console.log(`   🩺 Health: http://localhost:${PORT}/api/health`);
      console.log(`   🔍 Debug: http://localhost:${PORT}/api/companies/debug/all`);
      console.log(`==========================================\n`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;