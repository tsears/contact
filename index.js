var log = require('./modules/logging');
var server = require('./modules/server');
var config = require('./modules/config');
var SP = require('sharepoint');

log.write('Initializing...', 'init');

log.write('Loading Configuration', 'initinfo');
config.load('/etc/fusorContact/config.json');

var spo = new SP.RestService("https://fusorsoft.sharepoint.com");

spo.signin(config.spoUser, config.spoPass, function(err, data) {
	console.log('signed in');
	// check for errors during login, e.g. invalid credentials and handle accordingly. 
	if (err) {
		console.log("Error found: ", err);
		return;
	}

	var oList = spo.list('Documents');

	oList.get(function(err, data) {
		data.results.forEach(function(item) { 
			console.log(item.Id); 
			console.log(item.Title); 
		});
	});
});

log.write('Starting Server', 'initinfo');
server.start(8000);