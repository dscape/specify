var colors  = require('colors')
  , difflet = require('difflet')
  , decycle = require('cycle').decycle
  ;

module.exports = function default_reporter(name, report, errors) {
  if(typeof report === "undefined") {
    console.log();
    console.log("  " + name);
    return console.log();
  }
  errors = errors || [];
  var failed = report.fail + report.notrun;
  var symbol = failed === 0 ? ('✔'.green) : ('✗'.red);
  var right = report.ok + '/' + (report.ok+failed);
  process.stdout.write(symbol + ' ');
  process.stdout.write(right + ' ');
  var d = '';
  if(report.duration) {
    d = 'took '.grey + (report.duration + 'ms').green;
  }
  console.log(name.cyan + " " + d);
  errors.forEach(function(err) {
    if(typeof err === "string") {
      console.log('└───── '.grey + (err || "Error"));
    } else {
      console.log('└───── '.grey + (err.msg || "Error"));
      process.stdout.write('❝ '.grey + err.assert + ' ');
      if(err.assert === "ok") {
        console.log(err.args[0]);
      } else {
        console.log();
        if(err.args[0] && err.args[1] && typeof err.args[0]==="object" &&
             typeof err.args[1]==="object") {
          console.log(
            difflet({ indent : 2, comment : true })
              .compare(err.args[0], err.args[1]));
        } else {
          var indexzero = decycle(err.args[0] || "undefined")
            , indexone  = decycle(err.args[1] || "undefined")
            ;
          try {
            process.stdout.write(JSON.stringify(indexzero, null, 1).magenta);
            console.log((" // " +
              JSON.stringify(indexone, null, 1)).cyan);
          } catch (ex) {
            console.log(" // { \"circular\": \"⥁\"}".cyan);
          }
        }
      }
    }
  });
};