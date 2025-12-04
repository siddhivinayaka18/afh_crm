import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || '';

async function start() {
  try {
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.warn('⚠️  MONGO_URI not set. Please add it to .env file.');
    }

    // Routes
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'CRM API is running' });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/leads', leadRoutes);
    app.use('/api/customers', customerRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/users', userRoutes);

    // Serve frontend static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../frontend/dist')));

      // Handle React routing - send all non-API requests to index.html
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
      });
    }

    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
      console.log(`📍 API URL: http://localhost:${port}/api`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

start();
