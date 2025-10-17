const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin,getMyRegistrations } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
// Participant routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin route
router.post('/admin/login', loginAdmin); // <-- Add this new route
router.get('/my-registrations', protect, getMyRegistrations);

module.exports = router;