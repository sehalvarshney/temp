// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
  try {
    // Simple connection without deprecated options
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/companyDB');
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Start MongoDB service:');
    console.log('   - Windows: Open Services (services.msc) and start "MongoDB Server"');
    console.log('   - Or run: net start MongoDB');
    console.log('3. Try connecting with: mongod --dbpath="C:/data/db"');
    
    process.exit(1);
  }
};

module.exports = connectDb;