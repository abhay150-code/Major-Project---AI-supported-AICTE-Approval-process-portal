const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reviewerRoutes = require('./routes/reviewerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile, health checks, server-to-server)
      if (!origin) return callback(null, true);

      // Allow any .onrender.com domain, localhost, or configured FRONTEND_URL
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }

      // Default allow for production flexibility
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AICTE Approval Portal API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', reviewerRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

module.exports = app;
