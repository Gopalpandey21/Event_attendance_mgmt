const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  // This is the most important link. It must be unique.
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Registration',
    unique: true, // A user can only be marked as attended once per registration.
  },
  // We add direct links to user and event for easier queries later
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event',
  },
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;