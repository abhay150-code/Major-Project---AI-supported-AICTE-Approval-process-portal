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

// GET /api/applications/:id
async function getApplicationById(req, res, next) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        institution: true,
        assignedReviewer: { select: { id: true, name: true, email: true } },
        documents: {
          include: { requirement: true },
          orderBy: { requirement: { name: 'asc' } },
        },
        comments: {
          include: { reviewer: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (req.user.role === 'INSTITUTE') {
      const inst = await prisma.institution.findUnique({ where: { userId: req.user.id } });
      if (!inst || application.institutionId !== inst.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'REVIEWER') {
      if (application.assignedReviewerId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
}

// PUT /api/applications/:id
async function updateApplication(req, res, next) {
  try {
    const { applicationType, documents } = req.body;
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const inst = await prisma.institution.findUnique({ where: { userId: req.user.id } });
    if (!inst || application.institutionId !== inst.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!['DRAFT'].includes(application.status)) {
      return res.status(409).json({
        message: 'Only DRAFT or CORRECTION_REQUIRED applications can be edited',
      });
    }

    if (applicationType && !['NEW_APPROVAL', 'RENEWAL'].includes(applicationType)) {
      return res.status(400).json({ message: 'Invalid applicationType' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (applicationType && application.status === 'DRAFT') {
        await tx.application.update({
          where: { id: application.id },
          data: { applicationType },
        });
      }

      if (Array.isArray(documents)) {
        for (const docItem of documents) {
          if (!docItem.requirementId || !['PENDING', 'SUBMITTED'].includes(docItem.status)) {
            continue;
          }
          await tx.applicationDocument.updateMany({
            where: {
              applicationId: application.id,
              requirementId: docItem.requirementId,
            },
            data: {
              status: docItem.status,
              submittedAt: docItem.status === 'SUBMITTED' ? new Date() : null,
            },
          });
        }
      }

      return tx.application.findUnique({
        where: { id: application.id },
        include: {
          institution: true,
          documents: { include: { requirement: true } },
        },
      });
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// POST /api/applications/:id/submit (Database Transaction Example #2)
async function submitApplication(req, res, next) {
  try {
    const { submittedRequirementIds } = req.body || {};

    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const inst = await prisma.institution.findUnique({ where: { userId: req.user.id } });
    if (!inst || application.institutionId !== inst.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!['DRAFT', 'CORRECTION_REQUIRED'].includes(application.status)) {
      return res.status(409).json({
        message: 'Only DRAFT or CORRECTION_REQUIRED applications can be submitted',
      });
    }

    // Atomic Prisma Transaction: update checklist records and application status together
    const submittedApp = await prisma.$transaction(async (tx) => {
      if (Array.isArray(submittedRequirementIds) && submittedRequirementIds.length > 0) {
        await tx.applicationDocument.updateMany({
          where: {
            applicationId: application.id,
            requirementId: { in: submittedRequirementIds },
          },
          data: {
            status: 'SUBMITTED',
            submittedAt: new Date(),
          },
        });
      }

      const docs = await tx.applicationDocument.findMany({
        where: { applicationId: application.id },
        include: { requirement: true },
      });

      const missingRequired = docs.filter(
        (d) => d.requirement.isRequired && d.status === 'PENDING'
      );
      if (missingRequired.length > 0) {
        const err = new Error(
          `Cannot submit: required checklist items still pending (${missingRequired
            .map((d) => d.requirement.name)
            .join(', ')})`
        );
        err.statusCode = 400;
        throw err;
      }

      return tx.application.update({
        where: { id: application.id },
        data: { status: 'SUBMITTED' },
        include: {
          institution: true,
          documents: { include: { requirement: true } },
        },
      });
    });

    res.json(submittedApp);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApplication,
  listApplications,
  getApplicationById,
  updateApplication,
  submitApplication,
};
