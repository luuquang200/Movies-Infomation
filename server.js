require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars')

const app = express();
const port = process.env.PORT || 3000;
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

app.get('/', (req, res) => {
    res.render('content');
    }
);

app.listen(port, () => console.log(`App listening on port ${port}!`));