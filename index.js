let Logger = require('./modules/logging');
let server = require('./modules/server');
let Config = require('./modules/config');
let Throttler = require('./modules/throttler');
let Origin = require('./modules/origin');

let logger = new Logger(console);

log.write('Initializing...', 'init');
log.write('Loading Configuration', 'initinfo');
let config = new Config(require('./config.json'));
let throttler = new Throttler(5);
let origin = new Origin(config.allowedOrigins, config.defaults);

log.write('Starting Server', 'initinfo');
server.start(log, config, throttler, origin);
