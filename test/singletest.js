var specify = require('../specify');

specify.run(
  function(assert) {
    setTimeout(function () { assert.ok(true, "was true"); }, 1);
  }
);