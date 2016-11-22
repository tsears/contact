/* jslint node: true */
'use strict';

let Origin = require('../modules/origin.js');
let Config = require('../modules/config.js');

module.exports = {
  setUp: function(done) {
    let cfg = {
      allowedOrigins: [{
        origin: "www.foo.com",
        allowedFields: [
          "email",
          "request"
        ],
        toAddress: "to",
        mailSettings: {
          user : "user",
          pass : "pass",
          server : "server",
          port: 123,
          secure: false
        }
      }, {
        origin: "www.bar.com",
      }],
      server: {
        port: 1
      },
      defaults: {
        toAddress: "defaultToAddress",
        allowedFields: ['bar', 'baz'],
        mailSettings: {
          user : "defaultUser",
          pass : "defaultPass",
          server : "defaultServer",
          port: 123,
          secure: false
        },
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
    test.expect(14);

    let origin = new Origin(this.config.allowedOrigins, this.config.defaults);

    test.strictEqual(origin.origins["www.foo.com"].mailSettings.user, "user", "foo.com mail user should be 'user'");
    test.strictEqual(origin.origins["www.foo.com"].mailSettings.pass, "pass", "foo.com mail pass should be 'pass'");
    test.strictEqual(origin.origins["www.foo.com"].mailSettings.server, "server", "foo.com mail server should be 'server'");
    test.strictEqual(origin.origins["www.foo.com"].mailSettings.port, 123, "foo.com mail port should be 123");
    test.strictEqual(origin.origins["www.foo.com"].mailSettings.secure, false, "foo.com mail secure should be false");
    test.strictEqual(origin.origins["www.foo.com"].toAddress, "to", "foo.com toAddress should be 'to'");
    test.strictEqual(origin.origins["www.foo.com"].allowedFields[0], "email", "foo.com should allow 'email' as a submission field");

    test.strictEqual(origin.origins["www.bar.com"].mailSettings.user, "defaultUser", "bar.com email user should come from defaults");
    test.strictEqual(origin.origins["www.bar.com"].mailSettings.pass, "defaultPass", "bar.com email pass should come from defaults");
    test.strictEqual(origin.origins["www.bar.com"].mailSettings.server, "defaultServer", "bar.com mail server should come from defaults");
    test.strictEqual(origin.origins["www.bar.com"].mailSettings.port, 123, "bar.com mail port should come from defaults");
    test.strictEqual(origin.origins["www.bar.com"].mailSettings.secure, false, "bar.com mail secure should come from defaults");
    test.strictEqual(origin.origins["www.bar.com"].toAddress, "defaultToAddress", "bar.com toAddress should come from defaults");
    test.strictEqual(origin.origins["www.bar.com"].allowedFields[0], "bar", "bar.com allowedFields should come from defaults");

    test.done();
  }
};
