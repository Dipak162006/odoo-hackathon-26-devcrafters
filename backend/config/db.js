const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to Atlas or provided URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // fail fast in 5 seconds if connection fails
    });
    console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Atlas Connection Failed: ${error.message}`);
    console.log('Spinning up an In-Memory MongoDB for Hackathon fallback...');
    
    try {
      // Lazy load to prevent issues if not installed
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
      console.log(`Note: Data is saved temporarily in memory and will reset upon restart.`);
    } catch (fallbackError) {
      console.error(`Fallback failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
