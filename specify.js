var assert     = require('assert')
  , domain     = require('domain')
  , esprima    = require('esprima')
  , path       = require('path'), colors
  , reporters  = {}
  , assertions =
    [ 'ok', 'equal', 'notEqual', 'deepEqual', 'notDeepEqual'
    , 'strictEqual', 'notStrictEqual', 'ifError']
  , err_count  = 0
  , MAX_ERRORS    = process.env.SPECIFY_MAX_ERRORS    || 1000
  , CHECK_GLOBALS = process.env.SPECIFY_CHECK_GLOBALS ? true : false
  , GLOBALS       = Object.keys(global)
  , startTime
  ;

// read available reporters
require('fs').readdirSync(path.join(__dirname, 'reporters'))
  .forEach(function(reporter) {
    reporters[reporter]=require(path.join(__dirname, 'reporters', reporter));
});

module.exports = (function specify() {
  var cache     = []
    , counts    = { _totals: {ok: 0, fail: 0, notrun: 0, thrown: 0} }
    , spec, summary, def_summary, timer, current_domain
    , default_reporter = process.env.SPECIFY_REPORTER
      ? Object.keys(reporters)
        .indexOf(process.env.SPECIFY_REPORTER + ".js") === -1
        ? 'default'
        : process.env.SPECIFY_REPORTER
      : 'default'
    ;

  def_summary = summary = reporters[default_reporter + '.js'];

  function ensure_for(test, expect, tests, done) {
    var ensure = {}, count  = expect, errored = [];
    counts[test] = {ok: 0, fail: 0, notrun: 0, thrown: 0};
    counts[test].meta = {name: test, expected: expect, remaining: tests};
    counts[test].meta.errored = errored;
    counts[test].meta.remaining_assertions = expect;

    assertions.forEach(function(assertion) {
      ensure[assertion] = function () {
        if(counts[test].thrown > 0) {
          return;
        }
        try {
          assert[assertion].apply(this,arguments);
          counts._totals.ok++;
          counts[test].ok++;
        }
        catch (err) {
          errored.push({ msg: err.message
            , assert: assertion, args: [].slice.call(arguments,0)});
          counts._totals.fail++;
          counts[test].fail++;
        }
        count--;
        counts[test].meta.remaining_assertions = count;
        if(count === 0) {
          done(errored);
        }
      };
    });

    ensure.expect = function (nr) { count = nr; };
    return ensure;

  }

  function check_globals () {
    var end_globals = Object.keys(global)
      , leaks = end_globals.filter(function (eg) {
        return !~GLOBALS.indexOf(eg);
      });
    return leaks;
  }

  //
  // lifted from esprima's `detectnestedternary` example
  //
  function traverse(object, visitor) {
    var key
      , child
      ;

    visitor.call(null, object);
    for (key in object) {
      if (object.hasOwnProperty(key)) {
        child = object[key];
        if (typeof child === 'object' && child !== null) {
          traverse(child, visitor);
        }
      }
    }
  }

  function run_tests(tests) {
      if(timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      if(tests.length === 0) {
        var leaks = check_globals();
        leaks.forEach(function (leak) {
          console.log('leak detected: ' + leak);
        });
        counts._totals.duration = Date.now() - startTime;
        summary('summary', counts._totals);
        process.exit(counts._totals.fail === 0 ? 0 : -1);
      }
      else {
        var test    = tests.shift()
          , name    = test[0]
          , timeout = test[1]
          , f       = test[2]
          , expect
          ;
        if(typeof timeout === "function") {
          f = timeout;
          timeout = undefined;
        }
        // Need to add () so that it's a complete JS script
        var program = esprima.parse("(" + f.toString() + ")")
          , vari
          ;

        // Get argument identifiers from the function passed to specify
        if (program.body[0].expression.type === "FunctionExpression") {
          vari = program.body[0].expression.params.map(function(value) {
            return value.name;
          });
        }

        if(Array.isArray(vari) && vari.length > 0) {
          // Traverse program looking for assert.* function calls
          var numberOfAsserts = 0
            , expected        = false
            ;
          traverse(program, function(node) {
            if (node.type === 'MemberExpression' &&
                node.object.name === vari[0] &&
                assertions.indexOf(node.property.name) !== -1) {
              numberOfAsserts++;
            }
            else if (node.type === 'MemberExpression' &&
                node.object.name === vari[0] &&
                node.property.name === 'expect') {
              // will be specified later on but before nextTick
              expected=true;
            }
          });

          if(numberOfAsserts || expected) {
            expect = numberOfAsserts;
            current_domain = domain.create();
            current_domain.on('error', domainHandler(name));
            return current_domain.run(function () {
              if(timeout) {
                timer = setTimeout(function (){
                  throw new Error("Timeout");
                }, timeout);
              }
              process.nextTick(function (){
                var start = Date.now();
                f(ensure_for(name, expect, tests, function (errors) {
                  counts[name].duration = Date.now() - start;
                  summary(name, counts[name], errors);
                  run_tests(tests);
                }));
              });
            });
          } else {
            summary(name, {ok: 0, fail: 1, notrun: 0, thrown: 0},
              [' you need to add at least one `'+ vari[0] + '.*` call']);
          }
        } else {
          summary(name, {ok: 0, fail: 1, notrun: 0, thrown: 0},
            [' `assert` must be the first argument of your callback']);
        }
        counts._totals.fail++;
        run_tests(tests);
      }
  }

  spec = function specify_test(name, f) {
    cache.push([].slice.call(arguments,0));
  };

  spec.reporter = function (f) {
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
    if(typeof filter === "function") {
      cache  = [["main", filter]];
      filter = [];
    }
    summary(module.parent.filename.replace(process.cwd(), ""));
    startTime = Date.now();
    filter = typeof filter === "string" ? [filter] : filter;
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

  function domainHandler(test_name) {
    return function (err) {
      var current_test = counts[test_name].meta;
      if(counts[test_name].thrown > 0) {
        // ignore, this test already thrown at least once
        // lets just wait for the socket to c
        return;
      }
      err_count++;
      if(MAX_ERRORS === err_count) {
        err.message = "You have reached " + MAX_ERRORS +
          " errors so we decided to abort your tests\noriginal: " +
          err.message;
        throw err;
      }
      err = typeof err === "string" ? new Error(err) : err; // idiotpatching
      err.stacktrace = err.stack.split("\n").splice(1)
        .map(function (l) { return l.replace(/^\s+/,""); });
      counts[current_test.name].notrun += current_test.remaining_assertions;
      counts._totals.notrun += current_test.remaining_assertions;
      counts[current_test.name].thrown++;
      counts._totals.thrown++;
      current_test.errored.push(
        {msg: err.message || err, assert: "equal", args: ["domain", err]});
      summary(current_test.name, counts[current_test.name]
        , current_test.errored);
      run_tests(current_test.remaining);
    };
  }

  return spec;
})();
