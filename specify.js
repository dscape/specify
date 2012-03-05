var assert     = require('assert')
  , assertions = 
    [ 'fail', 'ok', 'equal', 'notEqual', 'deepEqual', 'notDeepEqual'
    , 'strictEqual', 'notStrictEqual', 'throws', 'doesNotThrow', 'ifError' ]
  , colors
  ;
module.exports = (function describe() {
  try { colors = require('colors'); } catch (e) {}
  function c(msg,color) { return colors ? msg[color] : msg; }
  var cache     = []
    , counts    = { _totals: {ok: 0, fail: 0} }
    , desc
    ;
  function ensureFor(test, expect, done) {
    var ensure = {}, count  = expect;
    assertions.forEach(function(assertion) {
      counts[test] = {ok: 0, fail: 0};
      ensure[assertion] = function () {
        try {
          assert[assertion].apply(this,arguments); 
          counts._totals.ok++;
          counts[test].ok++;
        }
        catch (ex) {
          counts._totals.fail++;
          counts[test].fail++;
        }
        count--;
        if(count === 0) { 
          done();
        }
      };
    });
    return ensure;
  }
  function runTests(tests) {
    if(tests.length === 0) {
      var symbol = counts._totals.fail === 0 ? c('✔', 'green') : c('✗','red');
      process.stdout.write(symbol + ' ');
      process.stdout.write(c('summary', 'yellow') + " ");
      console.log(counts._totals.ok + ' worked, ' + 
        counts._totals.fail + ' failed ');
      process.exit(counts._totals.fail === 0 ? 0 : -1);
    }
    else {
      var test   = tests.shift()
        , name   = test[0]
        , f      = test[1]
        , fbody  = f.toString()
        , vari   = fbody.match(/\((\w+)/m)
        , expect
        ;
      if(Array.isArray(vari) && vari.length > 0) {
        var match = fbody.match(new RegExp("assert\\.\\w", "gm"));
        if(match) {
          expect = match.length;
          return f(ensureFor(name, expect, function () {
            var symbol =
              counts[name].fail === 0 ? c('✔', 'green') : c('✗','red');
            process.stdout.write(symbol + ' ');
            process.stdout.write(c(name, 'cyan') + " ");
            console.log(counts[name].ok + ' worked, ' + 
              counts[name].fail + ' failed ');
            runTests(tests);
          }));
        } else {
          console.log(c('✗ ','red') + c(name, 'cyan') 
            + ' you need to add at least on `assert.*` call');
        }
      } else {
        console.log(c('✗ ','red') + c(name, 'cyan') 
          + ' `assert` must be the first argument of your callback');
      }
      counts._totals.fail++;
      runTests(tests);
    }
  }
  desc = function describeTest(name, f) {
    cache.push([].slice.call(arguments,0));
  };
  desc.run = function runAllTests(filter) {
    if(filter.length !== 0) {
      var filtered_cache = [];
      filter.forEach(function (e) {
        cache.forEach(function (c){
          var name = c[0];
          if(name===e) filtered_cache.push(c);
        });
      });
      runTests(filtered_cache);
    }
    else {
      runTests(cache);
    }
  };
  return desc;
})();