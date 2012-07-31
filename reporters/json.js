var decycle = require('cycle').decycle;

module.exports = function default_reporter(name, report, errors) {
  var json_report = 
    { name   : name
    , report : report
    , errors : errors
    };
  console.log(JSON.stringify(decycle(json_report)));
};