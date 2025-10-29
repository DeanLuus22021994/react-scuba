import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import availabilityRoutes from './routes/availability.js';
import bookingRoutes from './routes/bookings.js';
import contactRoutes from './routes/contacts.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://www.google-analytics.com"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later.',
      status: 429,
      retryAfter: 900 // 15 minutes in seconds
    }
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: (req, res) => {
    res.status(429).json({
      error: {
        message: 'Too many requests from this IP, please try again later.',
        status: 429,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      }
    });
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res, next) => {
  try {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error('Health check failed', error);
    next(error);
  }
});

// API routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/availability', availabilityRoutes);

// Error handling middleware
app.use((err, req, res, _next) => {
  logger.error('API Error', {
    error: err,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500,
      ...(isDevelopment && { stack: err.stack })
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
    },
  });
});

app.listen(PORT, () => {
  logger.info('Server started', { port: PORT, environment: process.env.NODE_ENV });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason,
    promise: promise.toString(),
    location: 'process.unhandledRejection'
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception - Server will exit', error);
  process.exit(1);
});

export default app;
