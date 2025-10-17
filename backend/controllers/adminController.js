const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
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
    const totalAttendees = await Attendance.countDocuments();
    const totalEvents = await Event.countDocuments();

    // Send all stats in a single JSON response
    res.json({
      totalRegistrations,
      totalAttendees,
      totalEvents,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard stats.' });
  }
};

module.exports = { getDashboardStats };