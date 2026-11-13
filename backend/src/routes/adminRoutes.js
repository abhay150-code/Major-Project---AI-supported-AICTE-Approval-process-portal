const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { getDashboard, listUsers, listAllApplications } = require('../controllers/adminController');

const router = express.Router();
const adminGuard = [authMiddleware, requireRole('ADMIN')];
router.get('/dashboard', ...adminGuard, getDashboard);
router.get('/users', ...adminGuard, listUsers);
router.get('/applications', ...adminGuard, listAllApplications);

module.exports = router;
