import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDatabase();

    app.listen(PORT, () => {
      console.log('========================================');
      console.log(`✅ Shop Manager Backend Server Running`);
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`☁️  Database: MongoDB Atlas (Cloud)`);
      console.log('========================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();