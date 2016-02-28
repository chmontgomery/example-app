var morgan = require('morgan');
var Stream = require('stream');
var logger = require('./logger')('lib/core/request-logger');

var bunyanStream = new Stream();
bunyanStream.writable = true;
bunyanStream.write = (obj) => {
  logger.info('%s', obj.trim()); // remove unnecessary newlines coming from morgan
};

// uses morgan because of its accuracy with timing requests
module.exports = () => {
  return morgan('dev', {
    stream: bunyanStream
  });
};
