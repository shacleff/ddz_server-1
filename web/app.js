const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');
const path = require('path');
const usersRouter = require('./routes/users');
const api = require('./routes/api');

let app = express();

app.set('superSecret', config.jwtsecret); 
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use('/users', usersRouter);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log(404);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    console.log(err);
    // render the error page
    // res.status(err.status || 500);
    // res.render('error');
});

module.exports = app;
