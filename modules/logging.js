var colors = require('colors');

colors.setTheme({
	error: 'red',
	info: 'grey',
	init: 'cyan',
	initinfo: 'yellow'
});

function logDate() {
	return new Date().toISOString();
}

exports.write = function (message, level, req) {
	var msg = '';
	if (req && req.connection && req.connection.remoteAddress) {
		msg = 'fusorContact: ' + logDate() + ' (' + req.connection.remoteAddress + '): ' + message;
	} else {
		msg = 'fusorContact: ' + logDate() + ': ' + message;
	}

	console.log(msg[level]);
};