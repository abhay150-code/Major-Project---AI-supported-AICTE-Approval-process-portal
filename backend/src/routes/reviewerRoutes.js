const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const {
  getAssignedApplications,
  addReviewComment,
  updateApplicationStatus,
} = require('../controllers/reviewerController');

const router = express.Router();

router.get(
  '/reviewer/applications',
  authMiddleware,
  requireRole('REVIEWER'),
  getAssignedApplications
);
router.post(
  '/applications/:id/comments',
  authMiddleware,
  requireRole('REVIEWER', 'ADMIN'),
  addReviewComment
);
router.put(
  '/applications/:id/status',
  authMiddleware,
  requireRole('REVIEWER', 'ADMIN'),
  updateApplicationStatus
);

module.exports = router;
