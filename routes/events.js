const express = require('express');
const CalendarEvent = require('../models/CalendarEvent');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new calendar event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, start_date, end_date, guest_name, email, review_taken_by, phone, dob, visit_date, comments, ratings, rating, department } = req.body;

    const event = new CalendarEvent({
      title,
      description,
      start_date,
      end_date,
      guest_name,
      email,
      review_taken_by,
      phone,
      dob,
      visit_date,
      comments,
      ratings,
      rating,
      department
    });

    await event.save();

    res.status(201).json({
      message: 'Calendar event created successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all calendar events
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.start_date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const events = await CalendarEvent.find(filter).sort({ start_date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get calendar event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update calendar event
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, start_date, end_date, guest_name, email, review_taken_by, phone, dob, visit_date, comments, ratings, rating, department } = req.body;

    const event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      { title, description, start_date, end_date, guest_name, email, review_taken_by, phone, dob, visit_date, comments, ratings, rating, department },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    res.json({ message: 'Calendar event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete calendar event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }
    res.json({ message: 'Calendar event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

