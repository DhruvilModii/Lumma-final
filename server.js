import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads folder created');
}

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

// Static uploads folder
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Test Route
app.get('/api', (req, res) => {
  res.json({ message: 'Lumina API running' });
});

// 404 API handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    message: 'API route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Environment variables
const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/lumina_db';

console.log('Starting server...');
console.log('Mongo URI configured:', !!MONGO_URI);

// MongoDB Connection
mongoose.set('strictQuery', true);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });
