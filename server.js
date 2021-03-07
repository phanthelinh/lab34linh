const { static } = require('express');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const usersAPI = require('./src/usersAPI');

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
        res.redirect('/login');
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

app.get('/users', async (req,res) => {
    let queryId = req.query.id;
    if (queryId !== undefined) {
        let user = await usersAPI.getUserById(queryId);
        res.render('pages/users/profile', {user: user.data});
    } else {
        let users = await usersAPI.getUsers();
        res.render('pages/users/index', {users: users});
    }
});

app.get('/users/add', async (req,res) => {
    res.render('pages/users/add');
});

app.post('/users/add', async (req, res) => {
    let userModel = req.body;
    userModel.age = parseInt(userModel.age);
    
    let result = await usersAPI.addUser(userModel);
    if (result.data !== undefined) {
        res.redirect('/users');
    } 
    else {
        res.render('pages/users/add', {message: result.message});
    }
});

app.post('/users/delete', async (req, res) => {
    let deleteObj = req.body;
    let result = await usersAPI.deleteUser(deleteObj);
    res.contentType('application/json');
    res.json(result);
});


app.get('*', (req, res) => {
    console.log(req.baseUrl);
    res.render('pages/error', {page: req.url});
})

app.listen(8080, () => {
    console.log('app listen on port 8080');
})