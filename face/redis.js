var _ = require('underscore')
  , debug = require('../lib/debug')
  , redis = require('redis');

function FaceRedis() {
  var self = this;

  self._client = redis.createClient();
  self._namespace = 'face';
  self._namespaceDelim = ':';

  self._client.on('error', function (err) {
    console.log('Error ' + err);
  });

  self.inputAddNewImages = function(lifeUid, images, options, cb) {
    options = options || {};

    if (!_.isObject(images))
      return cb(new Error("Images must be a hash: { <imageId>: <imageUrl> }"));

    var ok = _.every(images, function(imageUrl, imageId) {
      return _.isString(imageUrl);
    });

    if (!ok)
      return cb(new Error("Images must be a hash: { <imageId>: <imageUrl> }"));

    var count = _.size(images);
    if (!count)
      return cb(null, 0);

    var args = [self.buildLifeKey(lifeUid, ['input', 'image'])];

    _.each(images, function(value, key) {
      args.push(key);
      args.push(value);
    });

    debug.log(images);
    debug.log(args);

    self._client.rpush(args, function(err) { cb(err, count); });
    return cb(null, count);
  };

  self.buildLifeKey = function(lifeUid, tokens) {
    tokens = _.flatten(tokens);
    tokens.unshift(lifeUid);
    return self.buildKey(tokens);
  };

  self.buildKey = function(tokens) {
    return self._namespace + self._namespaceDelim + tokens.join(self._namespaceDelim);
  };
}

module.exports = new FaceRedis();
