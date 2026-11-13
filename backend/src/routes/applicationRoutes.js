const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const {
  createApplication,
  listApplications,
  getApplicationById,
  updateApplication,
} = require('../controllers/applicationController');

const router = express.Router();

router.post('/', authMiddleware, requireRole('INSTITUTE'), createApplication);
router.get('/', authMiddleware, listApplications);
router.get('/:id', authMiddleware, getApplicationById);
router.put('/:id', authMiddleware, requireRole('INSTITUTE'), updateApplication);

module.exports = router;
