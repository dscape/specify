<a name="specify"/>
# specify

`specify` is the simplest way i could think to do node.js testing. it works with sync code and async code all the same.

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

unlike normal assert calls that throw, `specify` will always run all of the assertions.

the assert calls are functions that wrap the assert module. when you call them you are actually calling a callback.

the way i figure out how many asserts you will run is by [static-analysis]. putting it simply it means i count the numbers of time you wrote `assert.`. this doesn't work for a `for loop`, so in that case you can do something like this:

``` js
specify('more_assertions_than_asserts', function(assert) {
  assert.expect(5);
  for(var i in [1,2,3,4,5]) {
    assert.equal(i,i);
  }
});
```

`specify` runs tests in one by one, not in parallel. this means that if you set `assert.expect` higher than the number of asserts you actually do the rest of the tests wont run, cause you will never finish the current test.

`specify` is standalone, you don't need any special binaries to run it.

<a name="installation"/>
# installation

<a name="node"/>
## node.js

1. install [npm]
2. `npm install specify`
3. `var specify = require('specify');`

<a name="filtering"/>
# filtering

in `specify` you specify which tests you want to run:

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

<a name="timeouts"/>
## timeouts

`specify` supports timeouts, it throws an exception when the timeout is reached and handles it like any uncaught exception.

``` js
specify('foo', 50, function (assert) {
  call_to_db_that_takes_a_long_time(function (data) {
    assert.equal(data, 'foo');
  });
});
```

<a name="reporters"/>
# reporters

if you feel like the output sent to `stdout` is ugly you can do `npm install colors`. if thats still not good enough, write your own reporter and send in a pull request. now use it:

``` js
specify('specify#ask_for_a_specific_reporter', function(assert) {
  specify.summary('my_awesome_reporter');
  setTimeout(function (){
    assert.ok(true);
  },1);
});
```

you can also do this with a function if you like:

``` js
specify('specify#custom_reporter_from_function', function(assert) {
  specify.summary(function (name, report, errors) {
    console.log(name);
  });
  setTimeout(function () {
    assert.ok(false, 'i see dead people');
    assert.ok(true);
  },1);
});
```

<a name="roadmap"/>
# roadmap / limitations

pull requests are welcome!

## detect comments in static analysis step

``` js
specify('foo', function (assert) {
  // right now this requires you to do 
  // assert.expect(1);
  assert.equal('foo', 'foo');
  //assert.ok(true);
});
```

<a name="samples"/>
# samples

check out the tests in `test/specify.js`

<a name="contribute"/>
# contribute

everyone is welcome to contribute. patches, bug-fixes, reporters, new features.

1. create an [issue][issues] so the community can comment on your idea
2. fork `specify`
3. create a new branch `git checkout -b feature_name`
4. create tests for the changes you made
5. make sure you pass both existing and newly inserted tests
6. commit your changes
7. push to your branch `git push origin feature_name`
8. create an pull request

<a name="meta"/>
# meta

* code: `git clone git://github.com/dscape/specify.git`
* home: <http://github.com/dscape/specify>
* bugs: <http://github.com/dscape/specify/issues>
* build: [![build status](https://secure.travis-ci.org/dscape/specify.png)](http://travis-ci.org/dscape/specify)

`(oO)--',-` in [caos]

<a name="license"/>
# license

copyright 2012 nuno job <nunojob.com> `(oO)--',--`

licensed under the apache license, version 2.0 (the "license");
you may not use this file except in compliance with the license.
you may obtain a copy of the license at

    http://www.apache.org/licenses/LICENSE-2.0

unless required by applicable law or agreed to in writing, software
distributed under the license is distributed on an "as is" basis,
without warranties or conditions of any kind, either express or implied.
see the license for the specific language governing permissions and
limitations under the license

[npm]: http://npmjs.org
[issues]: http://github.com/dscape/specify/issues
[caos]: http://caos.di.uminho.pt/
[static-analysis]: http://en.wikipedia.org/wiki/Static_program_analysis