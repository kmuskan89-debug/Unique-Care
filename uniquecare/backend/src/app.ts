import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import healthRoutes from './routes/healthRoutes';
import issueRoutes from './routes/issueRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes that don't require database connection
app.use('/api', healthRoutes);

// Ensure DB connection for serverless environment
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In test env, DB is connected by setup.ts
    if (process.env.NODE_ENV !== 'test') {
      await connectDB();
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// API Routes that require database connection
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

export default app;
