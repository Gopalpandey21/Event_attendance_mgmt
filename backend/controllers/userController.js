const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Registration = require('../models/Registration');

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  // 1. Get user data from the request body
  const { name, email, password } = req.body;

  try {
    // 2. Check if a user with this email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If user exists, send an error response
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // 3. Create a new user in the database
    // The password will be automatically hashed by the pre-save hook in your User model
    const user = await User.create({
      name,
      email,
      password,
    });

    // 4. If the user was created successfully, send back their data and a token
    if (user) {
      res.status(201).json({ // 201 status means "Created"
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error, please try again.' });
  }
};


/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};


/**
 * @desc    Authenticate an ADMIN user & get token
 * @route   POST /api/users/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // --- Hardcoded Admin Check ---
  // This block will run first.
  if (email === 'admin@gmail.com' && password === 'admin123') {
    console.log('Hardcoded admin logged in successfully.');
    // If credentials match, send a successful response immediately.
    return res.status(200).json({
      _id: 'admin001', // Mock ID
      name: 'Default Admin',
      email: 'admin@gmail.com',
      role: 'admin',
      token: generateToken('admin001'), // Generate a valid token
    });
  }
  // --- End of Hardcoded Check ---


  // --- Database Admin Check (Original Logic) ---
  // This will only run if the hardcoded credentials are not used.
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied. User is not an admin.' });
    }

    // If a database admin is found, send their details
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};



/**
 * @desc    Get all registrations for the logged-in user
 * @route   GET /api/users/my-registrations
 * @access  Private
 */
const getMyRegistrations = async (req, res) => {
  try {
    // Find all registrations that match the logged-in user's ID
    // req.user._id is available because of our 'protect' middleware
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title'); // <-- This is key: it fetches the linked event's title

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching registrations.' });
  }
};



const getAllAttendees = async (req, res) => {
  try {
    // Find all registrations where checkInTime is not null
    const attendees = await Registration.find({ checkInTime: { $ne: null } })
      .populate('user', 'name email') // Get the name and email from the linked User model
      .populate('event', 'title');   // Get the title from the linked Event model

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching attendees.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
    getMyRegistrations,
    getAllAttendees
};