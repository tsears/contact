/* jslint node: true */
'use strict';

let Origin = require('../modules/origin.js');
let Config = require('../modules/config.js');

module.exports = {
  setUp: function(done) {
    let cfg = {
      allowedOrigins: [{
        origin: "www.foo.com",
        emailUser: "user",
        emailPass: "pass",
        toAddress: "to"
      }, {
        origin: "www.bar.com",
      }],
      server: {
        port: 1
      },
      defaults: {
        emailUser: "defaultUser",
        emailPass: "defaultPass",
        toAddress: "defaultToAddress"
      }
    };

    this.config = new Config(cfg);

    done();
  },

  'Origin Tests': function(test) {
    test.expect(3);

    let origin = new Origin(this.config.allowedOrigins, this.config.defaults);

    test.ok(origin.origins["www.foo.com"], "foo.com should be an allowed origin");
    test.ok(origin.origins["www.bar.com"], "bar.com should be an allowed origin");
    test.ok(!origin.origins["www.baz.com"], "baz.com should not be an allowed origin");

    test.done();
  },

  'Origin Configuration Tests': function(test) {
    test.expect(6);

    let origin = new Origin(this.config.allowedOrigins, this.config.defaults);

    test.strictEqual(origin.origins["www.foo.com"].emailUser, "user", "foo.com emailUser should be 'user'");
    test.strictEqual(origin.origins["www.foo.com"].emailPass, "pass", "foo.com emailPass should be 'pass'");
    test.strictEqual(origin.origins["www.foo.com"].toAddress, "to", "foo.com toAddress should be 'to'");

    test.strictEqual(origin.origins["www.bar.com"].emailUser, "defaultUser", "bar.com emailUser should come from defaults");
    test.strictEqual(origin.origins["www.bar.com"].emailPass, "defaultPass", "bar.com emailPass should come from defaults");
    test.strictEqual(origin.origins["www.bar.com"].toAddress, "defaultToAddress", "bar.com toAddress should come from defaults");

    test.done();
  }
};
