const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');

// Import routes
const chatRoutes = require('./routes/chat');
const speechRoutes = require('./routes/speech');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://generativelanguage.googleapis.com", "https://api.murf.ai"],
      mediaSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.maxRequests,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'VocaMate Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/speech', speechRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    name: 'VocaMate API',
    version: '1.0.0',
    description: 'Backend API for VocaMate - AI Voice Assistant',
    endpoints: {
      chat: '/api/chat',
      speech: '/api/speech',
      health: '/health'
    },
    features: [
      'AI Chat with OpenAI GPT-4 and Google Gemini',
      'Text-to-Speech with Murf AI',
      'Multi-language support',
      'Conversation context management'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  res.status(500).json({
    success: false,
    error: config.nodeEnv === 'development' ? error.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 VocaMate Backend is running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🌐 CORS Origin: ${config.corsOrigin}`);
  console.log(`🔑 OpenAI API: ${config.openai.apiKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔑 Gemini API: ${config.gemini.apiKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔑 Murf API: ${config.murf.apiKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
