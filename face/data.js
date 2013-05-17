var redis = require('./redis');

function FaceData(lifeUid) {
  var self = this;

  self.lifeUid = lifeUid;

  self.inputAddNewImages = function(images, cb) {
    return redis.inputAddNewImages(self.lifeUid, images, null, cb);
  };
}

module.exports = FaceData;
