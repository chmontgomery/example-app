var config = require('./src/lib/core/config');
var logger = require('./src/lib/core/logger')('server');
var port = config.get('PORT');

let app = require('./src/app')();

app.set('port', port);

app.listen(port, () => {
  logger.info('Server listening on port %s', port);
});
