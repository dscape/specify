var specify = require('../specify')
  , filters = process.argv.slice(2)
  ;

specify('specify:no_arguments_in_cb', function() {});

specify('specify#no_assertions', function (assert) {
  return;
});

specify('specify#dinosaurs', function(dino) {
  dino.ok({trex:true});
});

specify('specify#wrong_var', function(dino) {
  assert.ok({trex:"sad"});
});

specify('specify#sync', function(assert) {
  assert.ok(true);
});

specify('specify#all_assertions', function(assert) { 
  assert.ok(true);
  assert.equal(1,1);
  assert.notEqual(1,2);
  assert.deepEqual({a:1}, {a:1});
  assert.notDeepEqual({a:1}, {a:2});
  assert.strictEqual(3, 3);
  assert.notStrictEqual(3, 4);
});

specify('specify#assertion_with_optional_message', function(assert) { 
  assert.ok(false, "this is the error you are looking for");
  assert.ok(true,  "this won't appear");
  assert.ok(false, "this will");
});

specify('specify#custom_pretty_print', function(assert) {
  // set a custom reporter pretty print function
  specify.reporter(function (name, report, errors) {
    console.log(name + ' :: ' + JSON.stringify(errors));
  });
  assert.ok(false, 'i see dead people');
});

specify('specify#ask_for_a_specific_reporter', function(assert) {
  // reset reporter function
  specify.reporter('default');
  assert.ok(false, 'back to default');
});

specify('specify#custom_pretty_print_just_name', function(assert) {
  // set a custom repoter pretty print function
  specify.reporter(function (name, report, errors) {
    console.log(name);
  });
  assert.ok(false, 'i see dead people');
  assert.ok(true);
});

specify('specify#async', function(assert) {
  // reset reporter function
  specify.reporter();
  setTimeout(function () {
    assert.ok(true, "was true");
  }, 1);
});

specify('specify#timeout', 50, function(assert) {
  assert.ok(true);
  setTimeout(function () {
    assert.ok(true, "was true");
  }, 100);
});

specify('specify#timeout_after', 100, function(assert) {
  assert.ok(true);
  setTimeout(function () {
    assert.ok(true, "was true");
  }, 10);
});

specify('specify#more_assertions_than_asserts', function(assert) {
  assert.expect(5);
  for(var i in [1,2,3,4,5]) {
    assert.equal(i,i);
  }
});

specify('specify#differences:ok', function(assert) { 
  assert.ok(false, "Should be true");
});

specify('specify#differences:equal', function(assert) { 
  assert.equal(13,1, "One is love");
});

specify('specify#differences:equal_undefined', function(assert) { 
  assert.equal(undefined,1, "One is love");
});

specify('specify#differences:notequal', function(assert) { 
  assert.notEqual(2,2, "One two");
});

specify('specify#differences:deepequal', function(assert) { 
  assert.deepEqual({a: {b: 1}}, {a: {b: 3}}, "Blooper");
});

specify('specify#differences:notdeepequal', function(assert) { 
  assert.notDeepEqual({a:1}, {a:1}, "Not Deep");
});

specify('specify#differences:strictequal', function(assert) { 
  assert.strictEqual(5, 3, "Dont be like that");
});

specify('specify#differences:notstrictequal', function(assert) { 
  assert.notStrictEqual(4, 4, "3 4 knock on the door");
});

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

specify('specify#throws', function(assert) {
  throw "bla";
  assert.ok(true);
});

specify('specify#json_reporter', function (assert) {
  specify.reporter('json');
  assert.ok(true);
});

specify('specify#comments', function (assert) {
  assert.expect(2);
  assert.ok(true);
  //assert.ok(false);
  assert.ok(true);
});

specify('specify#comments_arent_detected', function (assert) {
  assert.ok(true);
  //assert.ok(true);
  /*assert.ok(true);*/
});

specify.run(filters);
