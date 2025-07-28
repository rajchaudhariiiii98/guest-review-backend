const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const CalendarEvent = require('../models/CalendarEvent');

const router = express.Router();

// Create a new review
router.post('/', async (req, res) => {
  try {
    const {
      username,
      guest_name,
      department,
      rating,
      comment,
      ratings,
      review_taken_by,
      phone,
      dob,
      visit_date,
      comments,
      email
    } = req.body;

    const review = new Review({
      username,
      guest_name,
      department,
      rating,
      comment,
      ratings,
      review_taken_by,
      phone,
      dob,
      visit_date,
      comments,
      email
    });

    await review.save();

    // --- Birthday Calendar Event Logic ---
    if (dob) {
      // dob expected as 'yyyy-mm-dd' or 'dd-mm-yyyy'
      let year, month, day;
      if (/\d{4}-\d{2}-\d{2}/.test(dob)) {
        // yyyy-mm-dd
        [year, month, day] = dob.split('-');
      } else if (/\d{2}-\d{2}-\d{4}/.test(dob)) {
        // dd-mm-yyyy
        [day, month, year] = dob.split('-');
      }
      if (month && day) {
        // Find the next occurrence of the birthday (this year or next)
        const now = new Date();
        let eventYear = now.getFullYear();
        const birthdayThisYear = new Date(eventYear, parseInt(month) - 1, parseInt(day), 0, 0, 0);
        if (birthdayThisYear < now) {
          eventYear += 1;
        }
        const start_date = new Date(eventYear, parseInt(month) - 1, parseInt(day), 0, 0, 0);
        const end_date = new Date(eventYear, parseInt(month) - 1, parseInt(day), 23, 59, 59);
        const title = `Birthday: ${guest_name}`;
        const description = `Guest: ${guest_name}\nPhone: ${phone}\nEmail: ${email}\nDepartment: ${department}\nReview: ${comment || comments || ''}\n---\nOffer a special birthday discount!`;
        try {
          await CalendarEvent.create({
            title,
            description,
            start_date,
            end_date,
            recurring: 'yearly',
            review_id: review._id, // Always link event to review
            // Include all review fields for view-only form
            guest_name: review.guest_name,
            email: review.email,
            review_taken_by: review.review_taken_by,
            phone: review.phone,
            dob: review.dob,
            visit_date: review.visit_date,
            comments: review.comments,
            ratings: review.ratings,
            rating: review.rating,
            department: review.department
          });
        } catch (eventErr) {
          // Log but do not block review creation
          console.error('Failed to create birthday calendar event:', eventErr.message);
        }
      }
    }
    // --- End Birthday Calendar Event Logic ---

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all reviews with optional filters
router.get('/', async (req, res) => {
  try {
    const { department, rating, search, limit } = req.query;
    let filter = {};

    if (department && department !== 'All Departments') {
      filter.department = department;
    }

    if (rating && rating !== 'All Ratings') {
      filter.rating = parseInt(rating);
    }

    if (search) {
      filter.$or = [
        { guest_name: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Review.find(filter).sort({ created_at: -1 });
    if (limit && !isNaN(parseInt(limit)) && parseInt(limit) > 0) {
      query = query.limit(parseInt(limit));
    }
    const reviews = await query;

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  try {
    const {
      username,
      guest_name,
      department,
      rating,
      comment,
      ratings,
      review_taken_by,
      phone,
      dob,
      visit_date,
      comments
    } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        username,
        guest_name,
        department,
        rating,
        comment,
        ratings,
        review_taken_by,
        phone,
        dob,
        visit_date,
        comments
      },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    // Delete any calendar events linked to this review
    await CalendarEvent.deleteMany({ review_id: review._id });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search review by guest_name, dob, and phone
router.get('/search', async (req, res) => {
  const { guest_name, dob, phone } = req.query;
  if (!guest_name || !dob || !phone) {
    return res.status(400).json({ message: 'guest_name, dob, and phone are required' });
  }
  try {
    const review = await Review.findOne({ guest_name, dob, phone });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

