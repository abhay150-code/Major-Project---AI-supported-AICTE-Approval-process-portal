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

  // 4. Demonstration Document Requirements (not official AICTE regulations)
  const requirementsData = [
    {
      name: 'Institutional Profile',
      description: 'Demonstration requirement: Basic institute details and trust registration',
      applicationType: 'ALL',
      isRequired: true,
    },
    {
      name: 'Faculty Information',
      description: 'Demonstration requirement: List of qualified teaching faculty members',
      applicationType: 'ALL',
      isRequired: true,
    },
    {
      name: 'Infrastructure Details',
      description: 'Demonstration requirement: Classrooms, laboratories, and library details',
      applicationType: 'ALL',
      isRequired: true,
    },
    {
      name: 'Land / Building Documents',
      description: 'Demonstration requirement: Ownership/lease records and building plan',
      applicationType: 'NEW_APPROVAL',
      isRequired: true,
    },
    {
      name: 'Course & Intake Statement',
      description: 'Demonstration requirement: Proposed or existing programs and intake',
      applicationType: 'ALL',
      isRequired: true,
    },
  ];

  const requirements = [];
  for (const req of requirementsData) {
    const saved = await prisma.documentRequirement.upsert({
      where: { name: req.name },
      update: {},
      create: req,
    });
    requirements.push(saved);
  }

  // 5. Sample Applications for Institute 1
  const existingApp1 = await prisma.application.findUnique({
    where: { applicationNumber: 'APP-2026-0001' },
  });

  if (!existingApp1) {
    const app1 = await prisma.application.create({
      data: {
        institutionId: inst1.id,
        assignedReviewerId: reviewer.id,
        applicationNumber: 'APP-2026-0001',
        applicationType: 'NEW_APPROVAL',
        status: 'UNDER_REVIEW',
      },
    });

    for (const req of requirements) {
      await prisma.applicationDocument.create({
        data: {
          applicationId: app1.id,
          requirementId: req.id,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });
    }

    await prisma.reviewComment.create({
      data: {
        applicationId: app1.id,
        reviewerId: reviewer.id,
        comment: 'Initial checklist documents received. Reviewing infrastructure details.',
      },
    });
  }

  const existingApp2 = await prisma.application.findUnique({
    where: { applicationNumber: 'APP-2026-0002' },
  });

  if (!existingApp2) {
    const app2 = await prisma.application.create({
      data: {
        institutionId: inst1.id,
        applicationNumber: 'APP-2026-0002',
        applicationType: 'RENEWAL',
        status: 'DRAFT',
      },
    });

    const renewalReqs = requirements.filter(
      (r) => r.applicationType === 'ALL' || r.applicationType === 'RENEWAL'
    );
    for (const req of renewalReqs) {
      await prisma.applicationDocument.create({
        data: {
          applicationId: app2.id,
          requirementId: req.id,
          status: 'PENDING',
        },
      });
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
