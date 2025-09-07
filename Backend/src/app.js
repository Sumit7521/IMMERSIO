// src/app.js
const cookieParser = require('cookie-parser');
const express = require('express')
const cors = require('cors')
const authRoute = require('./routes/auth.route')
const avatarRoute = require('./routes/avatar.route');

const app = express()

// CORS configuration for both HTTP and WebSocket
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Add both frontend and monitor
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-ws-protocol']
}));

app.use(express.json()); // parse JSON body
app.use(cookieParser()); // for reading cookies

// Routes
app.use('/api/auth', authRoute)
app.use('/api/avatar', avatarRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      http: 'running',
      websocket: 'ready'
    }
  })
})

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Metaverse Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      avatar: '/api/avatar',
      monitor: '/colyseus'
    }
  })
})

module.exports = app