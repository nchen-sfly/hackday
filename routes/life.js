var _ = require('underscore')
  , http = require('http')
  , querystring = require('querystring')
  , responseCache = require('../lib/responseCache')
  , uuid = require('uuid')
  , FaceData = require('../face/data');

exports.postImage = function(req, res) {
  var lifeUid = req.param('life') || uuid.v4();
  var images = req.body;
  var data = { 
    method: 'faceAddImages',
    params: [lifeUid, images],
  };
  var path = '/json?' + querystring.stringify({json: JSON.stringify(data)});

  var options = {
    host: 'api.thislife.local',
    port: 13000,
    path: path,
    method: 'GET',
  };
  console.log(options.host + ':' + options.port + options.path);
  var apiReq = http.request(options, function(apiRes) {
    console.log(options.host + ':' + options.port + ' => ' + apiRes.statusCode);

    var output = '';
    apiRes.on('data', function(chunk) {
      output += chunk;
    });

    apiRes.on('end', function() {
      console.log(data.method + ': ' + output);
      var result = JSON.parse(output.replace(/^\(|\)$/g, ''));
      if (!result.result || !result.result.success)
        return res.send(500);

      responseCache.add(lifeUid, res);
    });
  });
  apiReq.on('error', function(err) {
    console.log('Error: ' + err.message);
    res.send(500);
  });
//apiReq.write(JSON.stringify(data));
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
