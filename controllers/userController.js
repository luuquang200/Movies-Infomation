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
            res.cookie('sessionId', user.sessionId, {maxAge: 86400 * 1000, httpOnly: true });
            
            res.send('Login successful');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },
};
  