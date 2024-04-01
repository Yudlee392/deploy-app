const path = require('path');
var createError = require('http-errors');

const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const helpers = require('./handlebarsHelpers');
//store token
var cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.use(session({
    resave:true,
    saveUninitialized:false,
    secret: 'long_string_for_secret',
    cookie:{maxAge: 300000}}))
    
app.use(cookieParser());

const port = 3000;


const route = require('./routes'); //./routes/index.js
const db= require('./config/db')

//connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

//HTTP logger
// app.use(morgan('combined'))


//Template engine


app.engine(
    'hbs',
    exphbs({
        extname: '.hbs',
        helpers: helpers
        
    }),
    
);


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));

app.use(express.json());

//Route init
route(app);

const submissionRoute = require('./routes/submissionRoutes');
app.use(submissionRoute);
app.listen(port, () => {
        console.log(`App listening on port ${port}`);
});
