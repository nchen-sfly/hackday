var _ = require('underscore')
  , util = require('util');

if (!process.stdin) {
  process.stdout.write("Cannot open stdin\n");
  process.exit(1);
}

var input = '';
process.stdin.resume();
process.stdin.on('data', function(chunk) {
  input += chunk;
});
process.stdin.on('end', function() {
  parse(input);
});

function parse(json) {
  var data = JSON.parse(json);
  var images = {};
  _.each(data.result.items, function(item) {
    var shutterflyId = item.shutterflyId;
    images[shutterflyId] = getImageURL(shutterflyId);
  });

  process.stdout.write(JSON.stringify(images));
  process.stdout.write("\n");
  process.exit(0);
}

function getImageURL(id) {
  return 'http://im1.shutterfly.com/procgtaserv/' + id;
}
