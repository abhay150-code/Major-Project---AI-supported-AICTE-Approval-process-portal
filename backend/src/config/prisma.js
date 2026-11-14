const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

let databaseUrl = process.env.DATABASE_URL || '';

// Ensure sslmode=require is appended for remote cloud databases (e.g. Supabase pooler)
if (
  databaseUrl &&
  !databaseUrl.includes('localhost') &&
  !databaseUrl.includes('127.0.0.1') &&
  !databaseUrl.includes('sslmode=')
) {
  databaseUrl = `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}sslmode=require`;
}

const isRemote =
  databaseUrl &&
  !databaseUrl.includes('localhost') &&
  !databaseUrl.includes('127.0.0.1');

const pool = new Pool({
  connectionString: databaseUrl,
  ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
