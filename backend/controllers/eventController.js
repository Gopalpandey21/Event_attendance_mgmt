const fs = require('fs');
const path = require('path');
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


/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Admin)
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // 1. Delete the event's image from the /uploads folder
    const imagePath = path.join(__dirname, '..', event.imageUrl);
    fs.unlink(imagePath, (err) => {
      if (err) {
        // Log the error but continue, as the DB entries are more important
        console.error(`Failed to delete image: ${imagePath}`, err);
      }
    });

    // 2. Delete all registrations associated with this event
    await Registration.deleteMany({ event: event._id });

    // 3. Delete the event itself
    await event.deleteOne();

    res.json({ message: 'Event and all associated registrations deleted successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting event.' });
  }
};


/**
 * @desc    Get a single event by its ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching event details.' });
  }
};

/**
 * @desc    Update an existing event
 * @route   PUT /api/events/:id
 * @access  Private (Admin)
 */
const updateEvent = async (req, res) => {
  const { title, duration, venue, teamType, maxTeamSize } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update text fields
    event.title = title || event.title;
    event.duration = duration || event.duration;
    event.venue = venue || event.venue;
    event.teamType = teamType || event.teamType;
    event.maxTeamSize = teamType === 'Team' ? (maxTeamSize || event.maxTeamSize) : 1;

    // Check if a new image was uploaded
    if (req.file) {
      // 1. Delete the old image
      const oldImagePath = path.join(__dirname, '..', event.imageUrl);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error(`Failed to delete old image: ${oldImagePath}`, err);
      });
      // 2. Set the new image URL
      event.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating event.' });
  }
};



/**
 * @desc    Upload a certificate template for an event
 * @route   PUT /api/events/:id/upload-template
 * @access  Private (Admin)
 */
const uploadCertificateTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No template file uploaded.' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if an old template exists and delete it
    if (event.certificateTemplateUrl) {
      const oldTemplatePath = path.join(__dirname, '..', event.certificateTemplateUrl);
      fs.unlink(oldTemplatePath, (err) => {
        if (err) console.error(`Failed to delete old template: ${oldTemplatePath}`, err);
      });
    }

    // Save the path to the new template
    event.certificateTemplateUrl = `/uploads/${req.file.filename}`;
    await event.save();

    res.json({ 
      message: 'Template uploaded successfully.',
      path: event.certificateTemplateUrl 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while uploading template.' });
  }
};
module.exports = { 
  createEvent,
  getAllEvents, // <-- Export the new function
  registerForEvent,
  deleteEvent,
  getEventById,
  updateEvent,
  uploadCertificateTemplate
};