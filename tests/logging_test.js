/* jslint node: true */ 
'use strict';

var log = require('../modules/logging.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

console.log = function() {};

exports.test = {
  'Logging Test' : function(test) {
    test.expect(2);
    
    test.doesNotThrow(
      function() {
        log.write('Some Message');
      },
      Error, 'Should not throw when second argument is missing'
      );
    
    test.doesNotThrow(
      function() {
        log.write('Some Message', {});
      },
      Error, 'Should fall back to message if 2nd argument is garbage'
      );

    test.done();
  }
};