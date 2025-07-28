const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  guest_name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Front Office', 'Restaurant', 'Banquet', 'Housekeeping']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  // New fields for extended review data
  ratings: {
    type: Object,
    default: {}
  },
  review_taken_by: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  dob: {
    type: String,
    default: ''
  },
  visit_date: {
    type: String,
    default: ''
  },
  comments: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);

