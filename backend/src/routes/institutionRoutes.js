const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const {
  getMyInstitution,
  updateMyInstitution,
} = require('../controllers/institutionController');

const router = express.Router();

router.get('/me', authMiddleware, requireRole('INSTITUTE'), getMyInstitution);
router.put('/me', authMiddleware, requireRole('INSTITUTE'), updateMyInstitution);

module.exports = router;
