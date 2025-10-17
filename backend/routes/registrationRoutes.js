const express = require('express');
const router = express.Router();
const { checkInUser,getAllAttendees } = require('../controllers/registrationController');
const { protect,admin } = require('../middleware/authMiddleware'); // Assuming you have this

// For now, any logged-in user can scan. You might want an admin-only middleware here.
router.patch('/:id/check-in', protect, checkInUser);
router.get('/attendees', protect, admin, getAllAttendees);

module.exports = router;