require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars')
const cookieParser = require('cookie-parser');
const db = require('./utils/db');
const User = require('./models/userModel');
const userRouter = require('./routers/userRouter');
const contentRouter = require('./routers/contentRouter');

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.engine('hbs', hbs.engine(
    {
        extname: 'hbs',
        defaultLayout: 'main', 
        layoutsDir: __dirname + '/views/layouts/',  
        partialsDir: __dirname + '/views/partials/' 
    }
))
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
        const user = await User.findBySessionId(sessionId);
        if (user) {
            req.user = user;
        }
    }
    next();
});

app.use('/user', userRouter); 
app.use('/content', contentRouter);

app.get('/', (req, res) => {
    db.testDatabaseConnection();
    if (req.user) {
        res.redirect('/content');
    } else {
        res.redirect('/user/login');
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));