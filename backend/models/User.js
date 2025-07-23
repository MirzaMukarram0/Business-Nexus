const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Entrepreneur', 'Investor'],
    required: true
  },
  // Profile fields
  bio: {
    type: String,
    default: ''
  },
  // Entrepreneur fields
  startup: {
    type: String,
    default: ''
  },
  startupDescription: {
    type: String,
    default: ''
  },
  fundingNeed: {
    type: String,
    default: ''
  },
  pitchDeck: {
    type: String,
    default: '' // Could be a URL or file reference
  },
  // Investor fields
  investmentInterests: {
    type: String,
    default: ''
  },
  portfolio: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 