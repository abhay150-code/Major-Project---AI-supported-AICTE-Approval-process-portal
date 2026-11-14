const path = require('path');
// Ensure dotenv is loaded regardless of process launch location
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

let rawDatabaseUrl = process.env.DATABASE_URL || '';

const isRemote =
  rawDatabaseUrl &&
  !rawDatabaseUrl.includes('localhost') &&
  !rawDatabaseUrl.includes('127.0.0.1');

// Strip any sslmode query parameter so pg-connection-string does not force verify-full
// which causes 'self-signed certificate in certificate chain' errors with Supabase pooler
const cleanDatabaseUrl = rawDatabaseUrl
  ? rawDatabaseUrl.replace(/[?&]sslmode=[^&]+/g, '').replace(/\?$/, '')
  : '';

const pool = new Pool({
  connectionString: cleanDatabaseUrl,
  ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
  connectionTimeoutMillis: 15000,
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
