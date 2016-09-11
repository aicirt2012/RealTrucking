var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var domainMiddleware = require('express-domain-middleware');
var config = require('./config');


var imp = require('./server/routes/analytics/import');
var data = require('./server/routes/data/data');
var simulate = require('./server/routes/simulate/simulate');

var app = express().use(domainMiddleware);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'client')));
app.use(compression());



app.use('/api/import', imp);
app.use('/api/data', data);
app.use('/api/simulate', simulate);



app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {
    var body;
    if (app.get('env') === 'development') {
        body = {
            message: err.message,
            error: err.stack
        };
    } else {
        body = {
            message: err.message,
            error: {}
        }
    }
    console.error('error on request %d %s %s', process.domain.id, req.method, req.url);
    console.error(err.stack);
    res.status(err.status || 500);
    res.json(body);

    if(err.domain) {
        //you should think about gracefully stopping & respawning your server
        //since an unhandled error might put your application into an unknown state
    }
});

process.on('uncaughtException', function (err) {
    console.error('uncaughtException', err.stack);
    process.exit(1);
});

module.exports = app;
