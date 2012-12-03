var specify = require('../../specify');

specify.run(
  function(assert) {
    LEAKING = true;
    setTimeout(function () { assert.ok(true, "was true"); }, 1);
    // assert.ok(true, 'this is a comment')
    /*
      assert.ok('multiline too');
     */
  }
);