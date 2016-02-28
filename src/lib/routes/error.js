var config = require('../core/config');
var env = config.get('NODE_ENV');
var logger = require('../core/logger')('lib/routes/error');

// NOTE: need to leave "next" in param list, otherwise this won't get called
module.exports = (err, req, res, next) => { // err handler MUST have 4 args

  logger.error(err);

  var model = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error'
  };

  if (env !== 'production') {
    // will print stacktrace
    model.error = err;
  } else {
    // no stacktraces leaked to user
    model.error = {
      status: err.status,
      message: err.message
    };
  }

  res.status(model.status);
  res.render('error', model);
};
