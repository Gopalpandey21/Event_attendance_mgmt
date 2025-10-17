const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance'); // 1. Import the new Attendance model

/**
 * @desc    Check in a user by creating an attendance record
 * @route   PATCH /api/registrations/:id/check-in
 * @access  Private (Admin)
 */
const checkInUser = async (req, res) => {
  const registrationId = req.params.id;

  try {
    // Step 1: Find the original registration to validate the QR code
    const registration = await Registration.findById(registrationId).populate('user', 'name');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found. This QR code is invalid.' });
    }

    // Step 2: Check if an attendance record for this registration already exists
    const existingAttendance = await Attendance.findOne({ registration: registrationId });

    if (existingAttendance) {
      return res.status(400).json({ 
        message: `${registration.user.name} was already checked in at ${existingAttendance.checkInTime.toLocaleTimeString()}` 
      });
    }

    // Step 3: Create a new document in the Attendance collection
    await Attendance.create({
      registration: registrationId,
      user: registration.user._id,   // Get user ID from the populated registration
      event: registration.event, // Get event ID from the registration
    });

    res.status(200).json({ 
      message: `Check-in successful for ${registration.user.name}` 
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
    // Find all registrations where the checkInTime field exists and is not null
    const attendees = await Registration.find({ checkInTime: { $ne: null } })
      .sort({ checkInTime: -1 }) // Show most recent check-ins first
      .populate('user', 'name email')   // Get name and email from the linked User model
      .populate('event', 'title');    // Get the title from the linked Event model

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching attendees.' });
  }
};
module.exports = { 
  checkInUser,
  getAllAttendees 
};