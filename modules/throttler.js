var moment = require('moment');

class Throttler {
  constructor(maxRequests = 5, date = new Date()) {
    // purely for unit testing...
    this.lastClearDate = date;
    this.maxRequests = maxRequests;
    this.requests = {};
  }

  request(source) {
    this.requests[source]  = this.requests[source] ? ++this.requests[source] : 1;
  }

  isThrottled(source) {
    this._checkAndReset();
    return this.requests[source] > this.maxRequests;
  }

  requestCountForRequestor(requestor) {
    return this.requests[requestor] ? this.requests[requestor] : 0;
  }

  _checkAndReset() {
    if (this._daysSinceThrottleReset() > 0) {
      this.requests = {};
    }
  }

  _daysSinceThrottleReset() {
  	return moment().diff(this.lastClearDate, 'days');
  }

}

module.exports = Throttler;
