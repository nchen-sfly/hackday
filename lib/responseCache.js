var _ = require('underscore');

function ResponseCache() {
  var self = this;

  self.cache = {};

  self.add = function add(key, res) {
    var self = this;

    if (self.cache.hasOwnProperty(key))
      self.reply(key, 500);

    console.log('ResponseCache.add: ' + key);
    self.cache[key] = res;
    return self;
  };

  self.reply = function reply(key) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    if (!self.cache.hasOwnProperty(key)) {
      console.log('ResponseCache.reply: ' + key + ' => undefined');
      return self;
    }

    console.log('ResponseCache.reply: ' + key + ' => ' + JSON.stringify(args));
    var res = self.cache[key];
    res.send.apply(res, args);
    delete self.cache[key];
    return self;
  }
}

module.exports = new ResponseCache();
