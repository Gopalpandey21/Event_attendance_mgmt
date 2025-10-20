// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Registration = require('../models/Registration');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  // ... (this function is correct, no changes)
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
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

const loginUser = async (req, res) => {
  // ... (this function is correct, no changes)
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
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // FIX: Simplified the logic. If the role is not 'admin', deny access.
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied. User is not an admin.' });
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

const getMyRegistrations = async (req, res) => {
  // ... (this function is correct, no changes)
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching registrations.' });
  }
};


/**
 * @desc    Get all certificates earned by the logged-in user
 * @route   GET /api/users/my-certificates
 * @access  Private
 */
const getMyCertificates = async (req, res) => {
  try {
    // 1. Find all registrations for this user that HAVE been checked in
    const registrations = await Registration.find({ 
      user: req.user._id,
      checkInTime: { $ne: null } 
    })
    .populate('event', 'title certificateTemplateUrl'); // 2. Get the linked event info

    // 3. Filter out events where the admin hasn't uploaded a template yet
    const earnedCertificates = registrations
      .filter(reg => reg.event && reg.event.certificateTemplateUrl)
      .map(reg => reg.event); // 4. Return just the event info

    res.json(earnedCertificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching certificates.' });
  }
};
module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getMyRegistrations,
  getMyCertificates
  // FIX: Removed the redundant getAllAttendees
};