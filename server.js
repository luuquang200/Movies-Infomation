require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars')
const handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const User = require('./models/userModel');
const userRouter = require('./routers/userRouter');
const contentRouter = require('./routers/contentRouter');
const dataImportRouter = require('./routers/dataImportRouter');
const searchRouter = require('./routers/searchRouter');

// Register Handlebars helper
handlebars.registerHelper('addOne', function(value) {
    return value + 1;
});

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

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/user/login');
    }
}

app.use('/user', userRouter); 
app.use('/home', ensureAuthenticated, contentRouter);
app.use('/data-import', ensureAuthenticated, dataImportRouter);
app.use('/search', ensureAuthenticated, searchRouter);

app.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/home');
    } else {
        res.redirect('/user/login');
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));