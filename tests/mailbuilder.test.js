/* jslint node: true */
'use strict';

let MailBuilder = require('../modules/mailbuilder');

module.exports = {
  setUp: function(done) {

    this.settings = {
      allowedFields: ["foo", "bar"],
      toAddress: "foo@bar.baz"
    };

    done();
  },

  'Subject Test': function(test) {
    test.expect(1);

    let builder = new MailBuilder(this.settings, "a@b.com", {});
    let message = builder.getMessage();

    test.strictEqual(message.subject, "Contact request from a@b.com", "Subject doens't match expected");

    test.done();
  },

  'Allowed Fields Tests': function(test) {
    test.expect(2);

    let data = {
      bar: "a",
      baz: "b",
    };

    let builder = new MailBuilder(this.settings, "a@b.com", data);
    let message = builder.getMessage();

    let messageContainsBar = message.content.indexOf('bar') > -1;
    let messageContainsBaz = message.content.indexOf('baz') > -1;

    test.ok(messageContainsBar, "Message body should contain bar, as it is an allowed field");
    test.ok(!messageContainsBaz, "Message body shoudl NOT contain baz, as it is NOT an allowed field");

    test.done();
  },

  'Recipient Test' : function(test) {
    test.expect(1);

    let data = { };

    let builder = new MailBuilder(this.settings, "a@b.com", data);
    let message = builder.getMessage();

    test.strictEqual(message.to, "foo@bar.baz", "Recipeient should be foo@bar.baz");

    test.done();
  }
};
