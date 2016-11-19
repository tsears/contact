var http = require('http');
var qs = require('querystring');
var log = require('./logging');
var moment = require('moment');

var requestCounts = {};
var lastClear = '';

var allowedOrigins = [
	"http://localhost:4000",
	"http://fusorsoft.com",
	"http://www.fusorsoft.com"
];

exports.start = function(port) {
	lastClear = moment();
	log.write('Set last clear time to ' + lastClear.format('MM/D/YY HH:mm'), 'initinfo');

	http.createServer(function(request, response) {
		var requestingAddress = request.connection.remoteAddress;
		var numRequests = requestCounts[requestingAddress];
		var origin = request.headers.origin;
		var headers = getHeaders(origin);
		var method = request.method.toUpperCase();

		// reset throttles at least daily.
		if (daysSinceThrottleReset() > 1) {
			log.write('Resetting request counts', 'info');
			resetRequestCounts();
		}
		
		// throttling
		if (tooManyRequestsFromAddress(requestingAddress)) {
			log.write('Too Many Requests!', 'error', request);
			response.writeHead(429, 'Too Many Requests', headers);
			return response.end();
		}
		
		++requestCounts[requestingAddress];
		
		// check request origin
		log.write('Checking if origin ' + origin + 'is allowed', 'info');
		if (!originIsAllowed(origin)) {
			log.write('Invalid request from ' + origin, 'error', request);
			response.writeHead('403', 'Forbidden', headers);
			return response.end();
		}

		// fulfill request
		if (method === 'OPTIONS') {
			log.write('Responding to OPTIONS request (' + numRequests + ')', 'info', request);
		
			response.writeHead(204, "No Content", headers);
			return response.end();

		} else if(method === 'PUT') {
			log.write('Responding to PUT request (' + numRequests + ')', 'info', request);

			var requestBodyBuffer = [];

			request.on("data", function(chunk) {
				requestBodyBuffer.push(chunk);
			});

			request.on("end", function() {
				// Flatten our body buffer to get the request content.
				var requestBody = requestBodyBuffer.join( "" );
				console.log(requestBody);
			});

			response.writeHead(204, "No Content", headers);
			response.end();
		}  else {
			log.write('Received ' + method + ' request (' + numRequests + ')', 'info', request);
			log.write('Invalid request type', 'error', request);
			response.writeHead(405, "OK", {'Content-Type': 'text/plain'});
			return response.end();
		}

	}).listen(port);

	log.write('Server Started on port ' + port, 'initinfo');
};

function getHeaders(origin) {
	// w3c recommends you echo back the requesting origin after checking against an internal whitelist,
	// presumably to avoid divulging which origins are valid.
	var headers = {};
	headers["Access-Control-Allow-Origin"] =  originIsAllowed(origin) ? origin : '';
	headers["Access-Control-Allow-Methods"] = "PUT, OPTIONS";
	headers["Access-Control-Max-Age"] = '86400'; // 24 hours
	headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";

	return headers;
}

function originIsAllowed(origin) {
	return allowedOrigins.indexOf(origin) > -1;
}

function daysSinceThrottleReset() {
	return moment().diff(lastClear, 'days');
}

function resetRequestCounts() {
	requestCounts = {};
}

function requestsFromAddress(address) {
	if (!requestCounts[address]) {
		requestCounts[address] = 0;
	}

	return requestCounts[address];
}

function tooManyRequestsFromAddress(address) {
	return requestsFromAddress(address) > 5;
}