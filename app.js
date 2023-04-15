const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

import promClient from 'prom-client';
import { usersRouter } from './routes';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

register.registerMetric(httpRequestDurationMicroseconds);

const httpRequestCount = new promClient.Counter({
  name: 'http_request_count',
  help: 'Number of HTTP requests processed'
});

register.registerMetric(httpRequestCount);

const trackMetric = async (req, res, next) => {
  try {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      end({
        route: req.baseUrl + req.route?.path,
        method: req.method,
        code: res.statusCode
      });
    });
    httpRequestCount.inc();
    next();
  } catch (error) {
    next(error)
  }
}

app.use('/users', trackMetric, usersRouter);

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  throw err
});


export {
  app,
  register
};
