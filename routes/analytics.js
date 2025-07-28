const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Promotion = require('../models/Promotion');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    // Total reviews
    const totalReviews = await Review.countDocuments();

    // Active users (users who have created reviews in the last 30 days)
    // const thirtyDaysAgo = new Date();
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    // const activeUserIds = await Review.distinct('user_id', {
    //   created_at: { $gte: thirtyDaysAgo }
    // });
    // const activeUsers = activeUserIds.length;
    const activeUsers = 1;

    // Active promotions
    const activePromotions = await Promotion.countDocuments({
      valid_to: { $gte: new Date() }
    });

    // Average rating
    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]);
    const avgRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;

    res.json({
      totalReviews,
      activeUsers,
      activePromotions,
      avgRating: Math.round(avgRating * 10) / 10
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviews by department
router.get('/reviews-by-department', async (req, res) => {
  try {
    const reviewsByDepartment = await Review.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(reviewsByDepartment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get rating distribution
router.get('/rating-distribution', async (req, res) => {
  try {
    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Ensure all ratings (1-5) are represented
    const fullDistribution = [1, 2, 3, 4, 5].map(rating => {
      const found = ratingDistribution.find(item => item._id === rating);
      return {
        rating,
        count: found ? found.count : 0
      };
    });

    res.json(fullDistribution);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent activity
router.get('/recent-activity', async (req, res) => {
  try {
    const recentReviews = await Review.find()
      .sort({ created_at: -1 })
      .limit(10);

    const activity = recentReviews.map(review => ({
      type: 'review',
      message: `New review from ${review.guest_name}`,
      department: review.department,
      rating: review.rating,
      timestamp: review.created_at
    }));

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

