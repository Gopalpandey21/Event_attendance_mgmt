const Event = require('../models/Event');
const Registration = require('../models/Registration'); // <-- Import Registration model
const User = require('../models/User');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Admin)
 */
const createEvent = async (req, res) => {
  // ... (your existing createEvent function is correct and stays here)
  const { title, duration, venue, teamType, maxTeamSize } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an event image.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const event = new Event({
      title,
      duration,
      venue,
      imageUrl,
      teamType,
      maxTeamSize: teamType === 'Team' ? maxTeamSize : 1,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating event.' });
  }
};


/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
const getAllEvents = async (req, res) => {
  try {
    // Find all events in the database and sort them by creation date (newest first)
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events.' });
  }
};



/**
 * @desc    Register a user for an event
 * @route   POST /api/events/:id/register
 * @access  Private
 */
const registerForEvent = async (req, res) => {
  const { course, phone } = req.body;
  const eventId = req.params.id;
  const userId = req.user._id;

  try {
    const event = await Event.findById(eventId);
    const user = await User.findById(userId); // Fetch user details

    if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
    }
    if (!user) { // Should not happen with protect middleware, but good for robustness
        return res.status(404).json({ message: 'User not found.' });
    }

    const existingRegistration = await Registration.findOne({ event: eventId, user: userId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }

    const registration = await Registration.create({
      event: eventId,
      user: userId,
      course,
      phone,
    });
    
    // ✅ IMPROVEMENT: Send back specific data needed for the QR code
    res.status(201).json({
        message: 'Registration successful!',
        registrationId: registration._id,
        eventName: event.title,
        userName: user.name, // Assuming your User model has a 'name' field
        course: registration.course,
        phone: registration.phone,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
};
module.exports = { 
  createEvent,
  getAllEvents, // <-- Export the new function
  registerForEvent
};