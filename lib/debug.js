var util = require('util');

exports.log = function log(data) {
  return console.log(util.inspect(data, false, null));
};
