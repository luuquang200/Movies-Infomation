const express = require('express');
const router = express.Router();
const castController = require('../controllers/castController');

router.get('/:id', castController.getDetails);

module.exports = router;