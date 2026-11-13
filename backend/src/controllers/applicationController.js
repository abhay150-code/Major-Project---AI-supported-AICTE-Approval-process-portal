const prisma = require('../config/prisma');

function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  const ts = String(Date.now()).slice(-4);
  return `APP-${year}-${rand}${ts}`;
}

// POST /api/applications
async function createApplication(req, res, next) {
  try {
    const { applicationType } = req.body;

    if (!applicationType || !['NEW_APPROVAL', 'RENEWAL'].includes(applicationType)) {
      return res.status(400).json({
        message: 'applicationType must be NEW_APPROVAL or RENEWAL',
      });
    }

    const institution = await prisma.institution.findUnique({
      where: { userId: req.user.id },
    });
    if (!institution) {
      return res.status(400).json({ message: 'Complete your institution profile first' });
    }

    const requirements = await prisma.documentRequirement.findMany({
      where: {
        OR: [{ applicationType: 'ALL' }, { applicationType }],
      },
    });

    const application = await prisma.application.create({
      data: {
        institutionId: institution.id,
        applicationNumber: generateApplicationNumber(),
        applicationType,
        status: 'DRAFT',
        documents: {
          create: requirements.map((reqItem) => ({
            requirementId: reqItem.id,
            status: 'PENDING',
          })),
        },
      },
      include: {
        institution: true,
        documents: { include: { requirement: true } },
      },
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
}

// GET /api/applications
async function listApplications(req, res, next) {
  try {
    let where = {};

    if (req.user.role === 'INSTITUTE') {
      const institution = await prisma.institution.findUnique({
        where: { userId: req.user.id },
      });
      if (!institution) return res.json([]);
      where = { institutionId: institution.id };
    } else if (req.user.role === 'REVIEWER') {
      where = { assignedReviewerId: req.user.id };
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        institution: true,
        assignedReviewer: { select: { id: true, name: true, email: true } },
        documents: { include: { requirement: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(applications);
  } catch (err) {
    next(err);
  }
}


module.exports = { createApplication, listApplications };
