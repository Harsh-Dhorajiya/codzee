import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import taskRouter from './routes/task.routes';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './errors/app.error';

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/v1/tasks', taskRouter);

// 404 Route Interceptor
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Endpoint not found'));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
