const express = require('express');
const port = 8000;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(session({
    name: 'csvviewer',
    secret: 'viewcsv',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));
app.use(flash());
app.use(customMware.setFlash);
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//app.use(express.static('assets'));

app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log("error!")
    } else {
        console.log("express server running on port " + port);
    }
});