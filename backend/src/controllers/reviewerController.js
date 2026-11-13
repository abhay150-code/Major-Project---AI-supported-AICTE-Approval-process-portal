const prisma = require('../config/prisma');

const REVIEWER_ALLOWED_STATUSES = [
  'UNDER_REVIEW',
  'CORRECTION_REQUIRED',
  'APPROVED',
  'REJECTED',
];

// GET /api/reviewer/applications
async function getAssignedApplications(req, res, next) {
  try {
    const applications = await prisma.application.findMany({
      where: { assignedReviewerId: req.user.id },
      include: {
        institution: true,
        documents: { include: { requirement: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(applications);
  } catch (err) {
    next(err);
  }
}

// POST /api/applications/:id/comments
async function addReviewComment(req, res, next) {
  try {
    const { comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (req.user.role === 'REVIEWER' && application.assignedReviewerId !== req.user.id) {
      return res.status(403).json({ message: 'This application is not assigned to you' });
    }

    const savedComment = await prisma.reviewComment.create({
      data: {
        applicationId: application.id,
        reviewerId: req.user.id,
        comment: comment.trim(),
      },
      include: {
        reviewer: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(savedComment);
  } catch (err) {
    next(err);
  }
}


module.exports = { getAssignedApplications, addReviewComment };
