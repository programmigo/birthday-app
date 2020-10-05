var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Prometheus = require('prom-client');

var indexRouter = require('./routes/index');
var helloRouter = require('./routes/hello');
var metricsRouter = require('./routes/metrics');

var app = express();

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/hello', helloRouter);
app.use('/metrics', metricsRouter);

app.use((req, res, next) => {
  res.locals.startEpoch = Date.now()
  next()
})

app.use((req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch
  httpRequestDurationMicroseconds
    .labels(req.method, req.originalUrl, res.statusCode)
    .observe(responseTimeInMs)
  next()
})

module.exports = app;
