const { static } = require('express');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(session({
    secret: process.env.SESSION_SECRET || '', 
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1800000
    }
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const redirectLogin = (req, res, next) => {
    if (!req.session.useremail) {
        res.redirect('/login');
    } else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.useremail) {
        res.redirect('/home');
    } else {
        next();
    }
}

app.get('/', redirectLogin, (req, res) => {
    res.render('pages/home', {products: JSON.parse(process.env.PRODUCTS_LIST) || []});
});

app.get('/login', redirectHome, (req, res) => {
    res.render('pages/login');
})

app.post('/login', redirectHome, (req,res) => {
    // get the request body
    var loginUser = req.body || {email: '', password: ''};
    if (loginUser.email === process.env.LOGIN_EMAIL && loginUser.password === process.env.LOGIN_PASSWORD) {
        // redirect
        req.session.useremail = loginUser.email;
        res.redirect('/');
    } else {
        res.render('pages/login', {message: 'Invalid email or password'});
    }
});


app.listen(8080, () => {
    console.log('app listen on port 8080');
})