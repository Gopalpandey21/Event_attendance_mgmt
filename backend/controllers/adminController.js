// controllers/adminController.js
const Registration = require('../models/Registration');
// const Attendance = require('../models/Attendance'); // <-- THIS LINE IS GONE
const Event = require('../models/Event');

/**
 * @desc    Get dashboard statistics (registrations, attendees, events)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
  try {
    // Count the documents in each collection
    const totalRegistrations = await Registration.countDocuments();

    // FIX: Count registrations that HAVE a checkInTime,
    // instead of counting the deleted Attendance model
    const totalAttendees = await Registration.countDocuments({ checkInTime: { $ne: null } });

    const totalEvents = await Event.countDocuments();

    // Send all stats in a single JSON response
    res.json({
      totalRegistrations,
      totalAttendees,
      totalEvents,
    });
  } catch (error) {
    console.error('--- SERVER ERROR in getDashboardStats ---', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats in controller.' });
  }
};

module.exports = { getDashboardStats };