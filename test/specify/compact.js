var specify = require('../../specify');

specify('specify#circular_reference', function(assert) {
  function foo() {
    this.abc = "Hello"; this.go = this;
    return this;
  }
  var c = new foo();
  assert.equal(c,c);
  assert.equal(c,undefined);
  assert.equal(undefined,c);
  assert.equal({},c);
  assert.equal(c,{});
});

specify('specify#cascading_sync', function(assert) {
  var err = new Error("Testing")
    , body
    ;
 assert.ok(!err, "No error");
 assert.equal(body.name, "Body has name");
});

specify('specify#cascading_sync_first_works', function(assert) {
  var err
    , body
    ;
 assert.ok(!err, "No error");
 assert.equal(body.name, "Body has name");
});


specify('specify#does_this_run', function(assert) {
  var err = new Error("Testing")
    , body
    ;
 assert.equal(body.name, "Body has name");
 setTimeout(function() { assert.ok(!err, "No error"); }, 10);
});

specify('specify#they_all_blow', function(assert) {
  var err = new Error("Testing")
    , body
    ;
 assert.ok(!err, "No error");
 assert.equal(body.foobar, "Body has foobar");
 assert.equal(body.name, "Body has name");
});

specify('specify#throws', function(assert) {
  throw "bla";
  assert.ok(true);
});

specify.run();