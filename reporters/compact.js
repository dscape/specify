var colors  = require('colors')
  , tty     = require('tty')
  , difflet = require('difflet')
  , decycle = require('cycle').decycle
  ;

var isatty = tty.isatty(1) && tty.isatty(2)
  , width  = process.env.SPECIFY_MAXCOLS
    ? process.env.SPECIFY_MAXCOLS
    : isatty
      ? process.stdout.getWindowSize
        ? process.stdout.getWindowSize(1)[0]
        : tty.getWindowSize
          ? tty.getWindowSize()[1]
          : 70
      : 70
  , current_test   = ""
  , current_errors = {}
  ;

module.exports = function compact_reporter(name, report, errors) {
  // starting a new file
  if(typeof report === "undefined") {
    current_test = name;
    current_errors = {};
  } else if (name === "summary") { // finished testing
    var failed = report.fail + report.notrun
      , left   = failed === 0 ? ('✔'.green) : ('✗'.red)
      , right  = report.ok + '/' + (report.ok+failed)
      ;
    left += " " + current_test;
    var dots = new Array(
      Math.max(1, width - left.length - right.length)).join(".");
    console.log("%s %s %s", left, dots, right);
    current_test   = "";
    current_errors = {};
  } else { // errors
  
  }
};