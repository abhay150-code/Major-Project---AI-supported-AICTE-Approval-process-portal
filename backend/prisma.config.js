require('dotenv/config');
const { defineConfig } = require('prisma/config');

function withSslIfRemote(url) {
  if (!url) return url;
  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
  if (isLocal || url.includes('sslmode=')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
}

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: withSslIfRemote(process.env.DIRECT_URL || process.env.DATABASE_URL),
  },
});
