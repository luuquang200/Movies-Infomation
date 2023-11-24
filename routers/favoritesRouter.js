const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/add', userController.addFavoriteMovie);

module.exports = router;