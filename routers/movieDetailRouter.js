const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/:id', movieController.getDetails);
router.get('/:id/reviews', movieController.getReviews);

module.exports = router;