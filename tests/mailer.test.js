/* jslint node: true */
'use strict';

let Mailer = require('../modules/mailer.js');

// these tests are of dubious value....

module.exports = {
  setUp: function(done) {

    this.transport = () => { return true; };

    this.mailer = {
      createTransport: function(t) {
        return {
          sendMail: function(mail, cb) {
            // just send back the stuff that was emailed...
            cb(null, mail);
          },
          close: () => { return true; }
        };
      }
    };

    this.log = {
      write: () => { return true; }
    };

    done();
  },

  'Mailer Tests': function(test) {
    test.expect(1);

    let settings = {
      mailSettings: {
        user: "user",
        pass: "pass",
        server: "server",
        port: 123,
        secure: false
      },
      toAddress: "to"
    };

    let mailer = new Mailer(settings, this.mailer, this.transport, this.log);

    mailer.sendEmail("a", "b", "c").then((resp) => {

      test.ok(resp, "should echo back some data");
      test.done();
    });
  }
};
