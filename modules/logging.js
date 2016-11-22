var colors = require('colors');

class Logger {
	constructor(logDest) {
		this.logger = logDest;

		colors.setTheme({
			error: 'red',
			info: 'grey',
			init: 'cyan',
			initinfo: 'yellow'
		});
	}

	_logDate() {
		return new Date().toISOString();
	}

	write(message, level, req) {
		let msg = '';

		if (req && req.connection && req.connection.remoteAddress) {
			msg = 'fusorContact: ' + this._logDate() + ' (' + req.connection.remoteAddress + '): ' + message;
		} else {
			msg = 'fusorContact: ' + this._logDate() + ': ' + message;
		}

		if (level === 'error') {
			this.logger.error(msg);
		} else {
			this.logger.log(msg[level]);
		}
	}
}

module.exports = Logger;
