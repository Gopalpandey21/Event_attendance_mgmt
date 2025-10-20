const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  venue: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Event banner
  teamType: { type: String, enum: ['Solo', 'Team'], default: 'Solo' },
  maxTeamSize: { type: Number, default: 1 },
  
  // --- ADD THIS LINE ---
  certificateTemplateUrl: { type: String, default: null }, // Path to the blank certificate image

}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;