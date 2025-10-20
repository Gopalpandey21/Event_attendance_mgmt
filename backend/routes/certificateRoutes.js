const express = require('express');
const router = express.Router();
const { downloadCertificate } = require('../controllers/certificateController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Special middleware to get token from URL query
const protectFromQuery = async (req, res, next) => {
  let token = req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

router.get('/download/:eventId', protectFromQuery, downloadCertificate);

module.exports = router;