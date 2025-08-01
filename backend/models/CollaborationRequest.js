const mongoose = require('mongoose');

const collaborationRequestSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Entrepreneur requests may not have an investor yet
  },
  entrepreneurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  requirements: {
    type: String,
    required: false
  },
  industry: {
    type: String,
    required: false
  },
  fundingAmount: {
    type: Number,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CollaborationRequest', collaborationRequestSchema); 