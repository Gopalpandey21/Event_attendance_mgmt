const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  venue: { type: String, required: true },
  imageUrl: { type: String, required: true }, // We will store the path to the image
  teamType: { type: String, enum: ['Solo', 'Team'], default: 'Solo' },
  maxTeamSize: { type: Number, default: 1 },
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;