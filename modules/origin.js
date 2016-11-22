class Origin {
  constructor(originInfo, defaults) {
    this.origins = {};
    for (let o of originInfo) {
      let fullData = o;

      if (!o.mailSettings) {
        fullData.mailSettings = defaults.mailSettings;
      } else {
        if (!o.mailSettings.user) {
          fullData.mailSettings.user = defaults.mailSettings.user;
        }

        if (!o.mailSettings.pass) {
          fullData.mailSettings.pass = defaults.mailSettings.pass;
        }

        if (!o.mailSettings.server) {
          fullData.mailSettings.server = defaults.mailSettings.server;
        }

        if (!o.mailSettings.port) {
          fullData.mailSettings.port = defaults.mailSettings.port;
        }

        if (!('secure' in o.mailSettings)) {
          fullData.mailSettings.secure = defaults.mailSettings.secure;
        }
      }

      if (!o.toAddress) {
        fullData.toAddress = defaults.toAddress;
      }

      if (!o.allowedFields) {
        fullData.allowedFields = defaults.allowedFields;
      }

      this.origins[o.origin] = fullData;
    }
  }
}

module.exports = Origin;
