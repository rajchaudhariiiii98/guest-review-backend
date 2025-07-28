const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  review_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    default: null
  },
  guest_name: { type: String, trim: true },
  email: { type: String, trim: true },
  review_taken_by: { type: String, trim: true },
  phone: { type: String, trim: true },
  dob: { type: String, trim: true },
  visit_date: { type: String, trim: true },
  comments: { type: String, trim: true },
  ratings: { type: Object, default: {} },
  rating: { type: Number, default: 0 },
  department: { type: String, trim: true },
  recurring: {
    type: String, // e.g., 'yearly'
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);

