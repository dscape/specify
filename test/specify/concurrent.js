var specify = require('../../specify')
  , error = new Error("Sockets. Not really")
  ;

specify('specify#parallel_uncaught', 50, function(assert) {
  // both throw, in different times, same test
  setTimeout(function (restaurant) {
    assert.ok(!error);
    assert.ok(restaurant.dog);
    assert.ok(false);
  }, 10);
  setTimeout(function (bar) {
    assert.ok(!error);
    assert.ok(bar.cat);
    assert.ok(true);
  }, 20);
});

specify('specify#also_throws', 50, function(assert) {
  setTimeout(function (coffeeplace) {
    assert.ok(!error);
    assert.ok(coffeeplace.mouse);
  }, 10);
});

specify('specify#ok', 50, function(assert) {
  assert.ok(true);
});

specify.run();