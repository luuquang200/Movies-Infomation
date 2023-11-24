const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const crypto = require('crypto');

function generateRandomSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = {
    register: async (req, res) => {
        try {
            const { username, password, name, email } = req.body;
    
            // Check if the login name is already in use
            const user = await User.findByUsername(username);
            if (user) {
                return res.status(400).json({ field: 'username', message: 'Username already in use' });
            }

            // Check if the email is already in use
            const userEmail = await User.findByEmail(email);
            if (userEmail) {
                return res.status(400).json({ field: 'email', message: 'Email already in use' });
            }
            
            // Encrypt password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Save user information to the database
            const newUser = new User({ username: username, password: hashedPassword, name: name, email: email });
            await User.insert(newUser);
            // console.log('newUser');
            // console.log(newUser.id);

            res.send('Registration successful');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
    
            // Check if the user exists
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(400).json({ field: 'username', message: 'Username not found' });
            }
    
            // Check if the password is correct
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ field: 'password', message: 'Incorrect password' });
            }

            // Create session ID
            user.sessionId = generateRandomSessionId();  
            await User.update(user.id, 'sessionid', user.sessionId);

            // Send the session ID in a cookie
            const remember = req.body.remember === 'on';
            if(remember) {
                const maxAge = 24 * 60 * 60 * 1000; // 1 day or session only
                // res.cookie('selectedRemember', true, { maxAge, httpOnly: true });
                res.cookie('sessionId', user.sessionId, { maxAge, httpOnly: true });
            }
            else {
                res.cookie('sessionId', user.sessionId, { httpOnly: true });
            }
            
            res.send('Login successful');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },

    // add a favorite movie to the database
    addFavoriteMovie: async (req, res) => {
        try {
            const user = await User.findBySessionId(req.cookies.sessionId);
            const movieId = req.body.movieId; 
            if (!user) {
                return res.status(400).json({ field: 'sessionId', message: 'Session ID not found' });
            }

            // check if the movie is already in the database
            const favoriteMovies = await User.getFavoriteMovies(user.id);
            if(favoriteMovies.find(movie => movie.id === movieId)) {
                return res.status(400).json({ field: 'movieId', message: 'Movie already in favorites' });
            }

            await User.addFavoriteMovie(user.id, movieId);
            res.json({ message: 'Movie added to favorites' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findBySessionId(req.cookies.sessionId);
            if (!user) {
                return res.status(400).json({ field: 'sessionId', message: 'Session ID not found' });
            }
            const selectedRemember = req.cookies.selectedRemember;
            // console.log(selectedRemember);
            const favoriteMovies = await User.getFavoriteMovies(user.id);
            res.render('profile', { user: user, favoriteMovies: favoriteMovies, selectedRemember: selectedRemember });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },

    logout: async (req, res) => {
        try {
            console.log('logout');
            const user = await User.findBySessionId(req.cookies.sessionId);
            if (!user) {
                return res.status(400).json({ field: 'sessionId', message: 'Session ID not found' });
            }
            user.sessionId = null;
            await User.update(user.id, 'sessionid', null);
            res.clearCookie('sessionId');
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
};
  