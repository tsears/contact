/* jslint node: true */
'use strict';

let logger = require('../modules/logging.js');

module.exports = {
  setUp: function(done) {
    class MockConsole {
      constructor() {
        this.logCalled = 0;
        this.errorCalled = 0;
      }

      log() {
        this.logCalled++;
      }

      error() {
        this.errorCalled++;
      }
    }

    this.mockConsole = new MockConsole();
    this.log = new logger(this.mockConsole);
    done();
  },

  'Argment Test 1': function(test) {
    test.expect(1);

    test.doesNotThrow(() => { this.log.write('Some Message');} , Error,
      'Should not throw when second argument is missing');

    test.done();
  },

  'Argument Test 2' : function(test) {
    test.expect(1);

    test.doesNotThrow(() => { this.log.write('Some Message', {}); }, Error,
      'Should fall back to message if 2nd argument is garbage');

    test.done();
  },

  'Calls Log Test': function(test) {
    test.expect(2);

    test.strictEqual(this.mockConsole.logCalled, 0, 'Log called (?)');
    this.log.write('blah');
    test.strictEqual(this.mockConsole.logCalled, 1, 'Log not called');

    test.done();
  },

  'Calls Error Test': function(test) {
    test.expect(2);

    test.strictEqual(this.mockConsole.errorCalled, 0, 'Error called (?)');
    this.log.write('Blah', 'error');
    test.strictEqual(this.mockConsole.errorCalled, 1, 'Error not called');

    test.done();
  }
};
