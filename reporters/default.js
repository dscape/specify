var colors;

try { colors = require('colors'); } catch (e) {}
function c(msg,color) { return colors ? msg[color] : msg; }

module.exports = function default_reporter(name, report, errors){
  errors = errors || [];
  var symbol = report.fail === 0 ? c('✔', 'green') : c('✗','red');
  process.stdout.write(symbol + ' ');
  process.stdout.write(report.ok + '/' + (report.ok+report.fail) + ' ');
  console.log(c(name, 'cyan') + " ");
  errors.forEach(function(err) {
    console.log(c('└───── ', 'grey') + err);
  });
};