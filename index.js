var logger = require('./modules/logging');
var server = require('./modules/server');
var config = require('./modules/config');

let log = new logger(console);
log.write('Initializing...', 'init');

log.write('Loading Configuration', 'initinfo');
config.load(process.env.PWD + '/config.json');

log.write('Starting Server', 'initinfo');
server.start(log, 8000);
