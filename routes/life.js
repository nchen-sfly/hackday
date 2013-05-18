var _ = require('underscore')
  , http = require('http')
  , querystring = require('querystring')
  , responseCache = require('../lib/responseCache')
  , uuid = require('uuid')
  , FaceData = require('../face/data');

function getImageURL(url) {
    if (url.indexOf('http://dim01-sc.dev.shutterfly.com') == 0)
        return 'http://ec2-174-129-167-23.compute-1.amazonaws.com/dev/image' + url.substring(34);
    return url;
}

exports.postImage = function(req, res) {
  var lifeUid = req.param('life') || uuid.v4();
  var images = req.body;

  var newImages = {};
  _.each(images, function(url, key) {
    newImages[key] = getImageURL(url);
  });

  var data = { 
    method: 'faceAddImages',
    params: [lifeUid, newImages],
  };
  var json = JSON.stringify(data);

  var options = {
    host: 'api.thislife.local',
    port: 13000,
    path: '/json',
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Content-Length": json.length
    }
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
      if (output) {
        var result = JSON.parse(output);
        if (result.result && !result.result.success)
          return res.send(500);
      }

      responseCache.add(lifeUid, res);
    });
  });
  apiReq.on('error', function(err) {
    console.log('Error: ' + err.message);
    res.send(500);
  });
  apiReq.write(json);
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
