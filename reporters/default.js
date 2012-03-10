var colors  = require('colors')
  , difflet = require('difflet')
  ;

module.exports = function default_reporter(name, report, errors){
  errors = errors || [];
  var symbol = report.fail === 0 ? ('✔'.green) : ('✗'.red);
  process.stdout.write(symbol + ' ');
  process.stdout.write(report.ok + '/' + (report.ok+report.fail) + ' ');
  console.log(name.cyan + " ");
  errors.forEach(function(err) {
    if(typeof err === "string") {
      console.log('└───── '.grey + err);
    } else {
      console.log('└───── '.grey + err.msg);
      process.stdout.write('❝ '.grey + err.assert + ' ');
      if(err.assert === "ok") {
        console.log(err.args[0]);
      } else {
        console.log();
        if(typeof err.args[0]==="object" && typeof err.args[1]==="object"){
          console.log(
            difflet({ indent : 2, comment : true })
              .compare(err.args[0], err.args[1]));
        } else {
          process.stdout.write(JSON.stringify(err.args[0], null, 1).magenta);
          console.log((" // " +
            JSON.stringify(err.args[1], null, 1)).cyan);
        }
      }
    }
  });
};