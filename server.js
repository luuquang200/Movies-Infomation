require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars')
const cookieParser = require('cookie-parser');
const User = require('./models/userModel');
const userRouter = require('./routers/userRouter');
const contentRouter = require('./routers/contentRouter');
const dataImportRouter = require('./routers/dataImportRouter');
const searchRouter = require('./routers/searchRouter');
const movieDetailRouter = require('./routers/movieDetailRouter');
const castDetailRouter = require('./routers/castDetailRouter');
const favoritesRouter = require('./routers/favoritesRouter');

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.engine('hbs', hbs.engine(
    {
        extname: 'hbs',
        defaultLayout: 'main', 
        layoutsDir: __dirname + '/views/layouts/',  
        partialsDir: __dirname + '/views/partials/',
        helpers: {
            equals: function(a, b) {
                return a === b;
            },

            ifCond: function(v1, operator, v2, options) {
                switch (operator) {
                    case '==':
                        return (v1 == v2) ? options.fn(this) : options.inverse(this);
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (v1 != v2) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },

            truncateText: function(text, limit) {
                if (text && text.length > limit) {
                    return text.substring(0, limit) + '...';
                }
                return text;
            },

            formatDate: function(date) {
                if (date) {
                    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
                } else {
                    return '';
                }
            }


        }

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
app.use('/movie', ensureAuthenticated, movieDetailRouter);
app.use('/cast', ensureAuthenticated, castDetailRouter);
app.use('/favorites', ensureAuthenticated, favoritesRouter);

app.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/home');
    } else {
        res.redirect('/user/login');
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));