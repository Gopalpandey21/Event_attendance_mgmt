// controllers/registrationController.js
const Registration = require('../models/Registration');

/**
 * @desc    Check in a user by updating their registration record
 * @route   PATCH /api/registrations/:id/check-in
 * @access  Private (Admin)
 */
const checkInUser = async (req, res) => {
  const { id: registrationId } = req.params;

  try {
    const registration = await Registration.findById(registrationId).populate('user', 'name');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found. Invalid QR code.' });
    }

    // FIX: Check if the checkInTime field already exists
    if (registration.checkInTime) {
      return res.status(400).json({
        message: `${registration.user.name} was already checked in at ${registration.checkInTime.toLocaleTimeString()}`,
      });
    }

    // FIX: Update the existing registration record with the check-in time
    registration.checkInTime = new Date();
    await registration.save();

    res.status(200).json({
      message: `Check-in successful for ${registration.user.name}`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during check-in.' });
  }
};


/**
 * @desc    Get all attendees (all checked-in registrations)
 * @route   GET /api/registrations/attendees
 * @access  Private (Admin)
 */
const getAllAttendees = async (req, res) => {
  try {
    // FIX: This query now works correctly because we are checking the `checkInTime` field
    const attendees = await Registration.find({ checkInTime: { $ne: null } })
      .sort({ checkInTime: -1 })
      .populate('user', 'name email')
      .populate('event', 'title');

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching attendees.' });
  }
};


module.exports = {
  checkInUser,
  getAllAttendees,
};