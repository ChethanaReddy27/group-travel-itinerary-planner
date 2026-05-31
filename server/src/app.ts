import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import searchRoutes from './routes/search';
import groupRoutes from './routes/groups';
import authRoutes from './routes/auth';

export function createApp(): express.Application {
  const app = express();

  // Middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'travel-planner-api' });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/groups', groupRoutes);

  // Serve static client assets if client/dist exists
  const clientDistPath = path.join(__dirname, '../../client/dist');
  if (fs.existsSync(clientDistPath)) {
    console.log(`Serving static client files from: ${clientDistPath}`);
    app.use(express.static(clientDistPath));
    
    // Serve client index.html for all non-API routes
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDistPath, 'index.html'));
      } else {
        next();
      }
    });
  } else {
    console.log(`Client build not found at ${clientDistPath}. API server only mode active.`);
  }

  // Global Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  return app;
}
