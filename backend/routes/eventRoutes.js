const express = require('express');
const router = express.Router();
// 1. Import both functions from the controller
const { createEvent, getAllEvents,registerForEvent } = require('../controllers/eventController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
// Define the route for creating an event (POST request)
router.post('/', upload.single('image'), createEvent);

// 2. Define the route for getting all events (GET request)
router.get('/', getAllEvents);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;