const express = require('express');

const app = express();

app.set('views', 'public/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('login');
});

app.listen(8080, () => {
    console.log('Server listen on port 8080');
})
