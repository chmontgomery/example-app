var logger = require('./logger')('lib/core/timer');

module.exports = (service, done) => {
  logger.info(service + ': ' + (done[0] * 1000 + Math.round(done[1] / 1000000)) + 'ms');
};
