var bunyan = require('bunyan');
var bformat = require('bunyan-format');
var config = require('./config');
var loggerLevel = config.get('LOGGER_LEVEL');

module.exports = (namespace) => {
  var loggerConfig = {
    name: namespace || 'app',
    level: loggerLevel
  };
  if (!config.get('NODE_ENV')) {
    loggerConfig.stream = bformat({outputMode: 'short'});
  }
  return bunyan.createLogger(loggerConfig);
};
