import dns from 'dns';
import mongoose from 'mongoose';

// Set DNS servers for reliable DNS resolution
try {
  dns.setServers(['1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS overrides are restricted by system environment
}

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shop_management_system';

  if (!mongoUri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

export default connectDatabase;
