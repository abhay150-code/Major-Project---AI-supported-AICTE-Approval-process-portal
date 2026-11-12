require('dotenv/config');
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL via Prisma 7');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

startServer();
