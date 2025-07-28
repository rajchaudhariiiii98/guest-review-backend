const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/guest-review-db'; // Update if your URI is different

const Review = require('../models/Review');
const CalendarEvent = require('../models/CalendarEvent');

async function migrateReviewId() {
  await mongoose.connect(MONGODB_URI);

  // Find all events missing review_id
  const events = await CalendarEvent.find({ review_id: null }).lean();
  let updated = 0;

  for (const event of events) {
    // Check if there is a Review with the same _id as the event's _id
    const review = await Review.findById(event._id);
    if (review) {
      await CalendarEvent.updateOne({ _id: event._id }, { $set: { review_id: event._id } });
      updated++;
    }
  }

  console.log(`Updated ${updated} events to include review_id.`);
  process.exit(0);
}

migrateReviewId().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
}); 