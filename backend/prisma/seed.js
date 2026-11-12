require('dotenv/config');
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

async function main() {
  console.log('Seeding AICTE Approval Portal database...');

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const reviewerPassword = await bcrypt.hash('Reviewer@123', 10);
  const institutePassword = await bcrypt.hash('Institute@123', 10);

  // 1. Admin user
  await prisma.user.upsert({
    where: { email: 'admin@aicte.demo' },
    update: {},
    create: {
      name: 'Portal Administrator',
      email: 'admin@aicte.demo',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // 2. Reviewer user
  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@aicte.demo' },
    update: {},
    create: {
      name: 'Dr. Priya Reviewer',
      email: 'reviewer@aicte.demo',
      password: reviewerPassword,
      role: 'REVIEWER',
    },
  });

  // 3. Institute users + Institution profiles (3NF separation)
  const inst1User = await prisma.user.upsert({
    where: { email: 'institute1@demo.com' },
    update: {},
    create: {
      name: 'Rajiv Gandhi Institute Admin',
      email: 'institute1@demo.com',
      password: institutePassword,
      role: 'INSTITUTE',
    },
  });

  const inst1 = await prisma.institution.upsert({
    where: { userId: inst1User.id },
    update: {},
    create: {
      userId: inst1User.id,
      institutionName: 'Rajiv Gandhi Institute of Technology',
      address: 'Cholanagar, R.T. Nagar Post, Bangalore, Karnataka',
      establishmentYear: 1998,
    },
  });

  const inst2User = await prisma.user.upsert({
    where: { email: 'institute2@demo.com' },
    update: {},
    create: {
      name: 'Nehru College Admin',
      email: 'institute2@demo.com',
      password: institutePassword,
      role: 'INSTITUTE',
    },
  });

  await prisma.institution.upsert({
    where: { userId: inst2User.id },
    update: {},
    create: {
      userId: inst2User.id,
      institutionName: 'Nehru College of Engineering',
      address: 'Pampady, Thrissur, Kerala',
      establishmentYear: 2002,
    },
  });

  
  console.log('Users seeded.');
}

main().finally(() => prisma.$disconnect());
