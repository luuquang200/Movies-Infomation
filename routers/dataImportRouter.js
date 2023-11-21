const express = require('express');
const router = express.Router();
const dataImportController = require('../controllers/dataImportController');

router.post('/', dataImportController.importData);
router.get('/', dataImportController.getUploadPage);

module.exports = router;