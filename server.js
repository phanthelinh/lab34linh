const express = require('express');

const app = express();

app.set('views', 'public/views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    res.send('It \'s Ok');
})

app.listen(8080, () => {
    console.log('Server listen on port 8080');
})
