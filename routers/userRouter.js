const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.get('/register', (req, res) => {
    res.render('register', { layout: 'main' });
});
router.post('/login', userController.login);
router.get('/login', (req, res) => {
    res.render('login', { layout: 'main' });
});


module.exports = router;