const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { getAssignedApplications, addReviewComment } = require('../controllers/reviewerController');

const router = express.Router();
router.get('/reviewer/applications', authMiddleware, requireRole('REVIEWER'), getAssignedApplications);
router.post('/applications/:id/comments', authMiddleware, requireRole('REVIEWER', 'ADMIN'), addReviewComment);

module.exports = router;
