var express = require('express');
var adaro = require('adaro');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
var indexHandler = require('./lib/routes/index');
var errorHandler = require('./lib/routes/error');
var requestLogger = require('./lib/core/request-logger');
var config = require('./lib/core/config');
var env = config.get('NODE_ENV');

module.exports = () => {
  var app = express();

  app.engine('dust', adaro.dust());
  app.set('view engine', 'dust');
  app.set('views', path.join(__dirname, 'views'));

  if (env !== 'production') {
    app.use(requestLogger()); // log all requests
  }
  app.use(cors());
  app.use(bodyParser.json());
  app.use(compression());

  // make all static files available under /public route
  app.use('/public', express.static(path.join(__dirname, '../public')));

  app.use('/_health', (req, res) => res.end('ok'));
  app.use('/favicon.ico', (req, res) => res.end());
  app.get('/', indexHandler);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // generic error handler
  app.use(errorHandler);

  return app;
};
