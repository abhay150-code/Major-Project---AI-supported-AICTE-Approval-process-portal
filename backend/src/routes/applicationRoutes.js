const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { createApplication, listApplications } = require('../controllers/applicationController');

const router = express.Router();
router.post('/', authMiddleware, requireRole('INSTITUTE'), createApplication);
router.get('/', authMiddleware, listApplications);

module.exports = router;
