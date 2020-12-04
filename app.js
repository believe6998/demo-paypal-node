const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const paymentRouter = require('./routes/payment');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AauA-3dgIqS4M0J5nFHUJANPBLEStIKopUmoMB9x2ZHko9o11HeHLGLFP93ag-T3qdLJsC7iDntZAvXP',
    'client_secret': 'EJfeRJhW1OLvQvA1hL1V55y_U6qtJm7j_yrCZnYJCk1V5hIUaVDTk-7DMpJoxcda1eyrEITuZDJNma6T'
});
app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', paymentRouter);

module.exports = app;
