const express = require('express');
const Promotion = require('../models/Promotion');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new promotion
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, discount, valid_from, valid_to } = req.body;

    const promotion = new Promotion({
      title,
      description,
      discount,
      valid_from,
      valid_to
    });

    await promotion.save();

    res.status(201).json({
      message: 'Promotion created successfully',
      promotion
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all promotions
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status === 'active') {
      filter.valid_to = { $gte: new Date() };
    } else if (status === 'expired') {
      filter.valid_to = { $lt: new Date() };
    }

    const promotions = await Promotion.find(filter).sort({ created_at: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get promotion by ID
router.get('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update promotion
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, discount, valid_from, valid_to } = req.body;

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { title, description, discount, valid_from, valid_to },
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.json({ message: 'Promotion updated successfully', promotion });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete promotion
router.delete('/:id', auth, async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

