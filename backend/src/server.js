require('dotenv/config');
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 5001;

// Bind to 0.0.0.0 so Render and cloud containers route traffic properly
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`AICTE Backend running on port ${PORT} (0.0.0.0:${PORT})`);
});

// Connect to database asynchronously so health checks pass immediately
prisma
  .$connect()
  .then(() => {
    console.log('Connected to PostgreSQL via Prisma 7');
  })
  .catch((err) => {
    console.error('Initial PostgreSQL connection error (queries will retry):', err.message);
  });

