const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// This route is protected, requiring both a login token and admin role
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;