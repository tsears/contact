class Origin {
  constructor(originInfo, defaults) {
    this.origins = {};
    for (let o of originInfo) {
      let fullData = o;

      if (!o.emailUser) {
        fullData.emailUser = defaults.emailUser;
      }

      if (!o.emailPass) {
        fullData.emailPass = defaults.emailPass;
      }

      if (!o.toAddress) {
        fullData.toAddress = defaults.toAddress;
      }

      if (!o.mailServer) {
        fullData.mailServer = defaults.mailServer;
      }

      this.origins[o.origin] = fullData;
    }
  }
}

module.exports = Origin;
