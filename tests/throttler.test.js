/* jslint node: true */
'use strict';

module.exports = {
  setUp: function(done) {
    this.Throttler = require('../modules/throttler');
    done();
  },

  'Reset Counters Tests': function(test) {
    test.expect(2);

    // this is non-deterministic :(

    let date = new Date();
    date.setDate(date.getDate() - 1);
    date.setMilliseconds(date.getDate() + 1000);
    let throttler = new this.Throttler(1, date);

    throttler.request("foo");
    throttler.request("foo");
    test.strictEqual(throttler.isThrottled("foo"), true, "Should be throttled");

    setTimeout(() => {
      test.strictEqual(throttler.isThrottled("foo"), false, "Throttle should have expired");
      test.done();
    }, 1200);


  },

  'Count Test' : function(test) {
    test.expect(2);
    let throttler = new this.Throttler(2);
    throttler.request("requestor");

    test.strictEqual(throttler.isThrottled("requestor"), false, "Shouldn't be throttled when under limit");

    throttler.request("requestor");
    throttler.request("requestor");

    test.strictEqual(throttler.isThrottled("requestor"), true, "Should be throttled when over limit");

    test.done();
  },

  'Request Count Test': function(test) {
    test.expect(2);

    let throttler = new this.Throttler();
    throttler.request("foo.com");
    throttler.request("foo.com");

    test.strictEqual(throttler.requestCountForRequestor("foo.com"), 2);
    test.strictEqual(throttler.requestCountForRequestor("bar.com"), 0);

    test.done();

  }
};
