'use strict';

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { isAPI } = require('./lib/utils');
require('./models'); // Connect DB & register models

var indexRouter = require('./routes/index');
var flitsRouter = require('./routes/api/flits'); //TODO: add user, auth routes



var router = express.Router();
router.use(function (req, res, next) {
req.user = userModel.find(req.body.userId);
next();
});

const authMiddleware = require('./lib/authMiddleware');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * Global Template variables
 */
app.locals.title = 'Flitter';

/**
 * Middlewares
 * Cada petición será evaluada por ellos
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Website routes
 */
app.use('/', require('./routes/index'));
// app.use('/anuncios', require('./routes/anuncios')); TODO: modificar con  users 

/**
 * API v1 routes
 */
// app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios')); TODO: modificar con users, auth
app.use('/apiv1/flits', authMiddleware, require('./routes/api/flits'));


// Route to flits
app.use('/apiv1/flits', flitsRouter);
app.use('/images/flits', express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'public')))


/**
 * Error handlers
 */
// catch 404 and forward to error handler
app.use( (req, res, next) => next(createError(404)) );

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.array) { // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req) ?
      { message: 'not valid', errors: err.mapped()}
      : `not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);
  
  // si es una petición al API respondo JSON:

  if (isAPI(req)) {
    res.json({ error: err.message });
    return;
  }

  // ...y si no respondo con HTML:

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.render('error');
});

module.exports = app;