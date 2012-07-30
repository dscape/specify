var difflet = require('difflet')
  , decycle = require('cycle').decycle
  ;

module.exports = function default_reporter(name, report, errors) {
  report.total = (report.ok+report.fail);
  report = {name: name, report: report};
  report.errors = (errors || []).map(function(err) {
    if(typeof err === "string") {
      return {message: (err || "Error")};
    } else {
      var this_err = {message: (err.msg || "Error")};
      if(err.assert === "ok") {
        this_err.assert = "ok";
        this_err.args = err.args;
        return this_err;
      } else {
        if(err.args[0] && err.args[1] && typeof err.args[0]==="object" &&
           typeof err.args[1]==="object") {
            this_err.args = err.args;
            this_err.diff = difflet({ indent : 2, comment : true })
              .compare(err.args[0], err.args[1]);
            return this_err;
        } else {
          var indexzero = decycle(err.args[0] || "undefined")
            , indexone  = decycle(err.args[1] || "undefined")
            ;
          this_err.args = [];
          try {
            this_err.args.push(JSON.stringify(indexzero, null, 1));
            this_err.args.push(JSON.stringify(indexone, null, 1));
          } catch (ex) {
            // circular
          }
          return this_err;
        }
      }
    }
  });
  console.log(JSON.stringify(report));
};