var log = require('./logging');

module.exports = {
	load: function(path) {
		var config = require(path);
		// this.spoUser = config.spoUser;
		// this.spoPass = config.spoPass;
	},
};
