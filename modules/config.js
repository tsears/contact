class Config {
	constructor(d) {
		let cfg = d;

		this._validate(cfg);

		this.allowedOrigins = cfg.allowedOrigins;
		this.defaults = cfg.defaults;
		this.server = cfg.server;
	}

	_validate(cfg) {
		this._validateRequiredSections(cfg);
		this._validateDefaults(cfg);
		this._validateSettings(cfg);
	}

	_validateDefaults(cfg) {
		// unless every origin contains keys for to, user, and pass - default must have
		// those present!
		if (!cfg.defaults) {
			for(let o of cfg.allowedOrigins) {
				if (
					!("mailSettings" in o) ||
					!("user" in o.mailSettings) ||
					!("pass" in o.mailSettings) ||
					!("server" in o.mailSettings) ||
					!("port" in o.mailSettings) ||
					!("secure" in o.mailSettings) ||
					!("toAddress" in o) ||
					!("allowedFields" in o)) {
					throw new Error("If there are no defaults specified, all origins must contain emailUser, emailPass, toAddress");
				}
			}
		} else {
			// if there is a defaults section, all fields must be present
			if (
					!("mailSettings" in cfg.defaults) ||
					!("user" in cfg.defaults.mailSettings) ||
					!("pass" in cfg.defaults.mailSettings) ||
					!("server" in cfg.defaults.mailSettings) ||
					!("port" in cfg.defaults.mailSettings) ||
					!("secure" in cfg.defaults.mailSettings) ||
					!("toAddress" in cfg.defaults) ||
					!("allowedFields" in cfg.defaults)) {
				throw new Error("If a defaults section is present, it must contain all fields");
			}
		}

	}

	_validateSettings(cfg) {
		if (!cfg.server.port) {
			throw new Error("Server section missing port");
		}
	}

	_validateRequiredSections(cfg) {
		if (!cfg.allowedOrigins) {
			throw new Error("Config missing allowed origins");
		}

		if (!cfg.server) {
			throw new Error("Config missing server section");
		}
	}
}

module.exports = Config;
