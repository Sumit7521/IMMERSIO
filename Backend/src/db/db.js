const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connected to MongoDB Atlas!");
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
}

module.exports = connectDB;
