var _ = require('underscore')
  , http = require('http')
  , uuid = require('uuid')
  , FaceData = require('../face/data');

exports.postImage = function(req, res) {
  var lifeUid = req.param('life') || uuid.v4();
  var images = req.body;
  var data = { 
    method: 'faceAddImages',
    params: [lifeUid, images],
  };

  var options = {
    host: 'api.thislife.local',
    port: 80,
    path: '/json',
    method: 'POST',
  };
  var apiReq = http.request(options, function(apiRes) {
    console.log(options.host + ':' + options.port + ' => ' + apiRes.statusCode);

    var output = '';
    apiRes.on('data', function(chunk) {
      output += chunk;
    });

    apiRes.on('end', function() {
      console.log(data.method + ': ' + JSON.stringify(output));
      res.send(output);
    });
  });
  apiReq.on('error', function(err) {
    console.log('Error: ' + err.message);
  });
  apiReq.write(JSON.stringify(data));
  apiReq.end();

/*
  var faceData = new FaceData(lifeUid);
  faceData.inputAddNewImages(images, function(err, count) {
    if (err)
      return res.send(err);

    res.send({
      'status': 0, 'message': 'Queued ' + count + ' images',
    });
  });
*/
};
