var path = require('path'),
  fs = require('fs'),
  nconf = require('nconf'),
  CONFIG_BASE_PATH = '../../config/',
  nodeEnv = process.env.NODE_ENV;

if (nodeEnv) {
  var configPath = path.join(__dirname, CONFIG_BASE_PATH, nodeEnv + '.json');
  fs.exists(configPath, (exists) => {
    if (!exists) {
      // cannot use services/logger here b/c it causes a circular dependency
      console.error(`Failed to load config for NODE_ENV=${nodeEnv}. File not found: ${configPath}`);
    }
  });
} else {
  nodeEnv = 'default';
}

nconf
  .argv()
  .env()
  .file(nodeEnv, path.join(__dirname, CONFIG_BASE_PATH, nodeEnv + '.json'))
  .file('default', path.join(__dirname, CONFIG_BASE_PATH, 'default.json'));

module.exports = nconf;
