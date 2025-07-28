const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/guest-review-db'; // Update if your URI is different

const Review = require('../models/Review');
const CalendarEvent = require('../models/CalendarEvent');

async function cleanupInvalidEvents() {
  await mongoose.connect(MONGODB_URI);

  // Get all valid review IDs
  const reviewIds = await Review.find({}, { _id: 1 }).lean();
  const validIds = new Set(reviewIds.map(r => String(r._id)));

  // Find events with missing or invalid review_id
  const events = await CalendarEvent.find({}).lean();
  const toDelete = events.filter(e => !e.review_id || !validIds.has(String(e.review_id)));

  if (toDelete.length === 0) {
    console.log('No invalid events found.');
    process.exit(0);
  }

  // Delete invalid events
  const result = await CalendarEvent.deleteMany({
    _id: { $in: toDelete.map(e => e._id) }
  });

  console.log(`Deleted ${result.deletedCount} invalid calendar events.`);
  process.exit(0);
}

cleanupInvalidEvents().catch(err => {
  console.error('Error cleaning up events:', err);
  process.exit(1);
}); 