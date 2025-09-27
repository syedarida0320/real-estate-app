// routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
//const auth = require('../middleware/auth');

router.get('/', reviewController.getReviews);
// router.get('/property/:propertyId', reviewController.getPropertyReviews);
// router.get('/agent/:agentId', reviewController.getAgentReviews);
// router.post('/', auth, reviewController.createReview);
// router.put('/:id', auth, reviewController.updateReview);
// router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;