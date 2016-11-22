let Logger = require('./modules/logging');
let server = require('./modules/server');
let Config = require('./modules/config');
let Throttler = require('./modules/throttler');
let Origin = require('./modules/origin');

let logger = new Logger(console);

logger.write('Initializing...', 'init');
logger.write('Loading Configuration', 'initinfo');
let config = new Config(require('./config.json'));
logger.write('Loading Throttle Control', 'initinfo');
let throttler = new Throttler(5);
logger.write('Loading Origin Counters', 'initinfo');
let origin = new Origin(config.allowedOrigins, config.defaults);

logger.write('Starting Server', 'initinfo');
server.start(logger, config, throttler, origin);
