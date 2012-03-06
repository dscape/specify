var assert     = require('assert')
  , path       = require('path'), colors
  , reporters  = {}
  , assertions = 
    [ 'ok', 'equal', 'notEqual', 'deepEqual', 'notDeepEqual'
    , 'strictEqual', 'notStrictEqual' ]
  ;
require('fs').readdirSync(path.join(__dirname, 'reporters'))
  .forEach(function(reporter) {
    reporters[reporter]=require(path.join(__dirname, 'reporters', reporter));
});
module.exports = (function specify() {
  var cache     = []
    , counts    = { _totals: {ok: 0, fail: 0} }
    , spec, summary, def_summary
    ;
  def_summary = summary = reporters['default.js'];
  function ensure_for(test, expect, done) {
    var ensure = {}, count  = expect, errored = [];
    assertions.forEach(function(assertion) {
      counts[test] = {ok: 0, fail: 0};
      ensure[assertion] = function () {
        try {
          assert[assertion].apply(this,arguments); 
          counts._totals.ok++;
          counts[test].ok++;
        }
        catch (err) {
          errored.push(err.message);
          counts._totals.fail++;
          counts[test].fail++;
        }
        count--;
        if(count === 0) { 
          done(errored);
        }
      };
    });
    ensure.expect = function (nr) { count = nr; };
    return ensure;
  }
  function run_tests(tests) {
    if(tests.length === 0) {
      summary('summary', counts._totals);
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
          return f(ensure_for(name, expect, function (errors) {
            summary(name, counts[name], errors);
            run_tests(tests);
          }));
        } else {
          summary(name, {ok: 0, fail: 1}, 
            [' you need to add at least on `assert.*` call']);
        }
      } else {
        summary(name, {ok: 0, fail: 1}, 
          [' `assert` must be the first argument of your callback']);
      }
      counts._totals.fail++;
      run_tests(tests);
    }
  }
  spec = function specify_test(name, f) {
    cache.push([].slice.call(arguments,0));
  };
  spec.summary = function (f) {
    if (typeof f === 'function') {
      summary = f;
      return;
    }
    else if (typeof f === 'string') {
      var reporter = reporters[f + '.js'];
      if(typeof reporter === 'function') {
        summary = reporter;
        return;
      }
    }
    summary = def_summary;
  };
  spec.run = function run_all_tests(filter) {
    if(filter && filter.length !== 0) {
      var filtered_cache = [];
      filter.forEach(function (e) {
        cache.forEach(function (c){
          var name = c[0];
          if(name===e) filtered_cache.push(c);
        });
      });
      run_tests(filtered_cache);
    }
    else {
      run_tests(cache);
    }
  };
  return spec;
})();