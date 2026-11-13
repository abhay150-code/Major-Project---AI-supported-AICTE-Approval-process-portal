const prisma = require('../config/prisma');

// GET /api/admin/dashboard
async function getDashboard(req, res, next) {
  try {
    const [
      totalUsers,
      totalInstitutions,
      totalReviewers,
      totalApplications,
      groupedByStatus,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.institution.count(),
      prisma.user.count({ where: { role: 'REVIEWER' } }),
      prisma.application.count(),
      prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);

    const applicationsByStatus = {
      DRAFT: 0,
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      CORRECTION_REQUIRED: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    for (const row of groupedByStatus) {
      applicationsByStatus[row.status] = row._count._all;
    }

    res.json({
      totalUsers,
      totalInstitutions,
      totalReviewers,
      totalApplications,
      applicationsByStatus,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users
async function listUsers(req, res, next) {
  try {
    const where = req.query.role ? { role: req.query.role } : {};
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        institution: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/applications
async function listAllApplications(req, res, next) {
  try {
    const applications = await prisma.application.findMany({
      include: {
        institution: true,
        assignedReviewer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(applications);
  } catch (err) {
    next(err);
  }
}


module.exports = { getDashboard, listUsers, listAllApplications };
