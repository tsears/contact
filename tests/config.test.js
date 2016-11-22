/* jslint node: true */
'use strict';


module.exports = {
  setUp: function(done) {
    this.Config = require('../modules/config');

    done();
  },

  'No throw on good file': function(test) {
    test.expect(1);

    let cfg = {
      allowedOrigins: [
        {
          origin: "http://foo.bar"
        },
        {
          origin: "http://bar.baz"
        }
      ],
      defaults : {
        "emailUser" : "blah",
        "emailPass" : "blahpass",
        "toAddress" : "someAddress"
      },
      server : {
        port: 8000
      }
    };

    test.doesNotThrow(() => { new this.Config(cfg); } , Error,
      'Should not throw on good file');

    test.done();
  },

  'Loads config tests': function(test) {
    test.expect(3);

    let cfg = {
      allowedOrigins: [
        {
          origin: "http://foo.bar"
        },
      ],
      defaults : {
        "emailUser" : "blah",
        "emailPass" : "blahpass",
        "toAddress" : "blahaddress"
      },
      server : {
        port: 8000
      }
    };

    let config = new this.Config(cfg);

    test.ok(config.allowedOrigins, 'allowedOrigins not present');
    test.ok(config.defaults, 'defaults not present');
    test.ok(config.server, 'server not present');

    test.done();
  },

  'Malformed Config Tests': function(test) {
    test.expect(2);

    let cfg = {
      defaults: true,
      server: true
    };

    test.throws(() => { new this.Config(cfg); }, Error, 'Should throw on missing allowedOrigins');

    let cfg2 = {
      allowedOrigins: true,
      defaults: true
    };

    test.throws(() => { new this.Config(cfg2); }, Error, 'Should throw on missing server section');

    test.done();
  },

  'Defaults Tests': function(test) {
    test.expect(4);

    let cfg = {
      allowedOrigins: [
        {
          origin: "foo.com",
          emailUser: "a",
          emailPass: "b",
          toAddress: "c"
        },
        {
          origin: "bar.com"
        }
      ],
      server: { port: 1}
    };

    let cfg2 = {
      allowedOrigins: [
        {
          origin: "foo.com",
          emailUser: "a",
          emailPass: "b",
          toAddress: "c"
        }
      ],
      server: { port: 1 }
    };

    let cfg3 = {
      allowedOrigins: [
        {
          origin: "foo.com",
        },
        {
          origin: "bar.com"
        }
      ],
      defaults: {
        emailUser: "a",
        emailPass: "b",
        toAddress: "c"
      },
      server: { port: 1 }
    };

    let cfg4 = {
      allowedOrigins: [],
      defaults: {
        emailUser: "a"
      },
      server: { port: 1 }
    };

    test.throws(() => { new this.Config(cfg); }, Error, "Should throw with incomplete origins and no defaults");
    test.doesNotThrow(() => { new this.Config(cfg2); }, Error, "Should not throw if all origins have all settings, even if no defaults");
    test.doesNotThrow(() => { new this.Config(cfg3); }, Error, "Should not throw if there is a complete defaults section, origins not required to have all");
    test.throws(() => { new this.Config(cfg4); }, Error, "If there is a defaults section, it is required to be complete");

    test.done();
  },

  'Settings Tests': function(test) {
    test.expect(2);

    let cfg = {
      allowedOrigins: [],
      server: {}
    };

    let cfg2 = {
      allowedOrigins: [],
      server: {
        port: 1
      }
    };

    test.throws(() => { new this.Config(cfg); }, Error, "Should throw if server is missing a required value");

    let c = new this.Config(cfg2);
    test.ok(c.server.port);

    test.done();
  }
};
