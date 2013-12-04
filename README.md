<a name="specify"/>
# specify

`specify` is the simplest way i could think to do node.js testing.

It works with sync code and async code all the same.

Please use versions `~0.6.x` for node `0.6` and `~1.0.x` for node `0.8` or higher.

If you don't like reading and want to see some code you can look at [nano's tests](https://github.com/dscape/nano/tree/master/tests) and learn there. Also read the `specify` source code; it's just a couple of lines of code.

``` js
var specify = require('specify');

specify('create_by_secret', function (assert) {
  user.create_by_secret({invitation_code: "1234321!!"}, function (err) {
    assert.equal(err.eid, "ec:api:user:create_by_secret:wrong_code");
    assert.equal(err.status_code, 400);
  });
});

specify.run();
```

The assert calls are callback functions that wrap the assert module. `specify` figures out how many callbacks you are calling by [static-analysis]. To put it simply, it counts the number of times you wrote `assert`. When that number of assertions is met, or when a timeout occurs, that test is complete and we can execute the next one.

Static analysis does not work for a `for` loop and some other flow control constructs. In that case you can use `assert.expect(nr)` to tell specify how many assertions to expect:

``` js
specify('more_assertions_than_asserts', function(assert) {
  assert.expect(5);
  for(var i in [1,2,3,4,5]) {
    assert.equal(i,i);
  }
});
```

`specify` runs tests one by one, not in parallel. If you set `assert.expect` higher than the number of `assert` function calls the execution will stop, and your current test will never finish. You can circumvent this by setting a timeout:

``` js
specify('foo', 50, function (assert) {
  call_to_db_that_takes_a_long_time(function (data) {
    assert.equal(data, 'foo');
  });
});
```

Because tests are serialized, `specify` can catch uncaught exceptions and continue to run. You will get a report about the error that was thrown somewhere in your stack. This is analogous to the functionality the community refers to as `domains`.

`specify` is standalone; you don't need any special binaries to run it.

If you think all these `specify` functions make your code look bloated, you can also run a single function:

``` js
var specify = require('specify')
  , request = require('request')
  ;

specify.run(

  function (assert) {

    var get = { uri: "http://someservice.com/1/apps/dscape", json: true }
      , del = { uri: "http://someservice.com/1/apps/dscape", method: "DELETE"
              , json : true }
      , app_name
      ;

    request(get, function (err, _, body) {

      assert.equal(err,null);
      assert.ok(body.rows);
      assert.ok(body.total_rows >= 1);
      assert.ok(body.rows.length >= 1);

      app_name = body.rows[0].value.app_name;
      del.uri += "/" + app_name;

      request(del, function (err, resp, body) {

        assert.equal(err,null);
        assert.equal(resp.statusCode, 200);
        assert.equal(body.app.name, app_name);
        assert.equal(body.app.user,"dscape");

      });

    });

  }

);
```

<a name="installation"/>
# installation

<a name="node"/>
## node.js

1. install [npm]
2. `npm install specify`
3. `var specify = require('specify');`

<a name="filtering"/>
# filtering

In `specify` you specify which tests you want to run:

``` js
var specify = require('specify')
  , filters = process.argv.slice(2)
  ;

specify('foo', function (assert) {
  assert.equal('foo', 'foo');
});

specify('bar', function (assert) {
  assert.equal('bar', 'baz', 'bar failed');
});

specify('baz', function (assert) {
  assert.equal('baz', 'baz');
});

specify.run(filters);
```

<a name="reporters"/>
# reporters

If you feel like the output sent to `stdout` is ugly, you can write your own reporter and send in a pull request.

Now use it:

``` js
specify('specify#ask_for_a_specific_reporter', function(assert) {
  specify.reporter('my_awesome_reporter');
  setTimeout(function (){
    assert.ok(true);
  },1);
});
```

You can also do this with a function if you like:

``` js
specify('specify#custom_reporter_from_function', function(assert) {
  specify.reporter(function (name, report, errors) {
    console.log(name);
  });
  setTimeout(function () {
    assert.ok(false, 'i see dead people');
    assert.ok(true);
  },1);
});
```

<a name="samples"/>
# samples

Samples are available in the `/test` folder.

<a name="contribute"/>
# contribute

Everyone is welcome to contribute. Patches, bug-fixes, reporters, new features.

1. Create an [issue][issues] so the community can comment on your idea
2. Fork `specify`
3. Create a new branch `git checkout -b feature_name`
4. Create tests for the changes you made
5. Make sure you pass both existing and newly inserted tests
6. Commit your changes
7. Push to your branch `git push origin feature_name`
8. Create a pull request

<a name="meta"/>
# meta

* Code: `git clone git://github.com/dscape/specify.git`
* Home: <http://github.com/dscape/specify>
* Bugs: <http://github.com/dscape/specify/issues>
* Build: [![build status](https://secure.travis-ci.org/dscape/specify.png)](http://travis-ci.org/dscape/specify)


`(oO)--',-` in [caos]

<a name="license"/>
# license

Copyright 2012 nuno job <nunojob.com> `(oO)--',--`

Licensed under the apache license, version 2.0 (the "license");
You may not use this file except in compliance with the license.
You may obtain a copy of the license at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the license is distributed on an "as is" basis,
without warranties or conditions of any kind, either express or implied.
see the license for the specific language governing permissions and
limitations under the license.

[npm]: http://npmjs.org
[issues]: http://github.com/dscape/specify/issues
[caos]: http://caos.di.uminho.pt/
[static-analysis]: http://en.wikipedia.org/wiki/Static_program_analysis
