var specify = require('../specify')
  , filters = process.argv.slice(2)
  ;

specify('specify#no_arguments_in_cb', function() {});

specify('specify#no_assertions', function (assert) {
  return;
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
  // set a custom summary pretty print function
  specify.summary(function (name, report, errors) {
    console.log(name + JSON.stringify(errors));
  });
  setTimeout(function () {
    assert.ok(false, 'i see dead people');
    assert.ok(true);
  },1);
});

specify('specify#ask_for_a_specific_reporter', function(assert) {
  // reset summary function
  specify.summary('default');
  setTimeout(function (){
    assert.ok(true);
  },1);
});

specify('specify#custom_pretty_print_just_name', function(assert) {
  // set a custom summary pretty print function
  specify.summary(function (name, report, errors) {
    console.log(name);
  });
  setTimeout(function () {
    assert.ok(false, 'i see dead people');
    assert.ok(true);
  },1);
});

specify('specify#async', function(assert) {
  // reset summary function
  specify.summary();
  setTimeout(function (){
    assert.ok(true);
  }, 1);
});

specify('specify#more_assertions_than_asserts', function(assert) {
  assert.expect(5);
  for(var i in [1,2,3,4,5]) {
    assert.equal(i,i);
  }
});

specify('specify#differences', function(assert) { 
  assert.ok(false, "Should be true");
  assert.equal(13,1, "One is love");
  assert.notEqual(2,2, "One two");
  assert.deepEqual({a: {b: 1}}, {a: {b: 3}}, "Blooper");
  assert.notDeepEqual({a:1}, {a:1}, "Not Deep");
  assert.strictEqual(5, 3, "Dont be like that");
  assert.notStrictEqual(4, 4, "3 4 knock on the door");
});

specify.run(filters);