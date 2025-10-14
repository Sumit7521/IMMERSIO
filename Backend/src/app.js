// src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import aiRoutes from './routes/ai.js';
import { router as meetRoutes } from './routes/meet.js';
import authRoute from './routes/auth.route.js';
import avatarRoute from './routes/avatar.route.js';
import { corsOptions } from './config/corsConfig.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// --- Middleware ---
app.use(cors(corsOptions));
// ✅ Removed `app.options('*', ...)` as it crashes Express v5
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static('public'));

// --- Routes ---
app.use('/api/auth', authRoute);
app.use('/api/avatar', avatarRoute);
app.use('/api', aiRoutes);
app.use('/api/meet', meetRoutes);

// --- Health check ---
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: { http: 'running', websocket: 'ready' },
  });
});

// --- Root ---
app.get('/', (req, res) => {
  res.json({
    message: 'Merged Metaverse + AI Classroom Backend',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      avatar: '/api/avatar',
      ai: '/api',
      meet: '/api/meet',
      monitor: '/colyseus',
    },
  });
});

// --- Error handling ---
app.use(errorHandler);

// ✅ 404 handler compatible with Express v5
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

export default app;
