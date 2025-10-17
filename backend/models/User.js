const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true, // No two users can have the same email
    lowercase: true,
    match: [
      /^\S+@\S+\.\S+$/, // Simple email validation
      'Please provide a valid email address.',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [6, 'Password must be at least 6 characters long.'],
    select: false, // Prevents the password from being sent back in API responses
  },
  role: {
    type: String,
    enum: ['participant', 'admin'], // The role can only be one of these two values
    default: 'participant', // New users are participants by default
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// IMPORTANT: Password Hashing Middleware
// This function runs automatically BEFORE a new user is saved to the database.
// It hashes the password so you never store plain text passwords.
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with a cost factor of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Method to compare candidate password with the stored hashed password
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model('User', userSchema);

module.exports = User;