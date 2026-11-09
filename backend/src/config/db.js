import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    const tipo = config.mongoUri.includes('mongodb.net') ? 'Atlas (cloud)' : 'Local';
    console.log(`✅ MongoDB conectado → ${tipo}`);
  } catch (error) {
    console.error('❌ Error de conexión MongoDB:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};
