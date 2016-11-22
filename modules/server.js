var http = require('http');
var qs = require('querystring');

exports.start = function(log, cfg, throttler, origin) {


	http.createServer(function(request, response) {
		let requestingAddress = request.connection.remoteAddress;
		let requestOrigin = request.headers.origin;
		let headers = getHeaders(requestOrigin);
		let method = request.method.toUpperCase();

		// throttling
		throttler.request(requestingAddress);

		if (throttler.isThrottled(requestingAddress)) {
			log.write(`Too Many Requests from ${requestingAddress}`, 'error', request);
			response.writeHead(429, 'Too Many Requests', headers);
			return response.end();
		}

		let numRequests = throttler.requestCountForRequestor(requestingAddress);

		// check request origin
		log.write(`Checking if origin ${requestOrigin} is allowed`, 'info');
		if (!origin.origins[origin]) {
			log.write(`Invalid request from ${requestOrigin}`, 'error', request);
			response.writeHead('403', 'Forbidden', headers);
			return response.end();
		}

		// fulfill request
		if (method === 'OPTIONS') {
			log.write(`Responding to OPTIONS request (${numRequests})`, 'info', request);

			response.writeHead(204, "No Content", headers);
			return response.end();

		} else if(method === 'PUT') {
			log.write(`Responding to PUT request (${numRequests})`, 'info', request);

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
			log.write(`Received ${method} request (${numRequests})`, 'info', request);
			log.write('Invalid request type', 'error', request);
			response.writeHead(405, "OK", {'Content-Type': 'text/plain'});
			return response.end();
		}

	}).listen(cfg.server.port);

	log.write(`Server Started on port ${cfg.server.port}`, 'initinfo');
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
