// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, registerForEvent,deleteEvent,getEventById,updateEvent,uploadCertificateTemplate } = require('../controllers/eventController');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware'); // FIX: Import admin middleware

// FIX: Added 'protect' and 'admin' middleware. Only logged-in admins can create events.
router.post('/', protect, admin, upload.single('image'), createEvent);

router.get('/', getAllEvents);
router.post('/:id/register', protect, registerForEvent);

// Route for deleting an event (Admin only)
router.delete('/:id', protect, admin, deleteEvent);

// Route for getting a SINGLE event (Public)
router.get('/:id', getEventById); // <-- ADD THIS

// Route for updating an event (Admin only)
router.put('/:id', protect, admin, upload.single('image'), updateEvent);


router.put('/:id/upload-template', protect, admin, upload.single('template'), uploadCertificateTemplate);

module.exports = router;