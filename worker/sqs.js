var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , responseCache = require('../lib/responseCache')
  , util = require('util')
  , SQS = require('aws-sqs');

function SQSWorker() {
  var self = this;

  self.sqs = new SQS('AKIAJ5UV4XV7V6LJYUJQ', 'IQU6f9VchkUoe+WmiHKuYHT1Yxr//wlFYDXO49eF');
  self.sqs.createQueue('6E5772AE-269A-4E8B-B37B-56B96D56BA90', {VisibilityTimeout: 10}, function (err, queue) {
    self.queue = queue;
    self.start();
  });

  self.start = function start() {
    self.receiveStart();
  };

  self.stop = function stop() {
  };

  self.receiveStart = function receiveStart() {
    self.sqs.receiveMessage(self.queue, {MaxNumberOfMessages: 1}, self.receiveCallback);
  };

  self.receiveCallback = function receiveCallback(err, msgs) {
    if (msgs) {
      console.log('sqs.receiveCallback: ' + msgs.length);

      for (var i = 0; i < msgs.length; i++) {
        var msg = msgs[i];

        try {
          var result = JSON.parse(msg.Body);
          var lifeUid = result.life;
          responseCache.reply(lifeUid, result);

          var resultPath = path.resolve(__dirname, '..', 'public', 'results', lifeUid);
          fs.writeFile(resultPath, msg.Body, function (err) {
            console.log('writeFile(' + resultPath + '): ' + (err ? err : 'Success'));
          });
        } catch (err) {
          console.error('Failed to parse msg: ' + msg.Body + ' : ' + err);
        }

        self.sqs.deleteMessage(self.queue, msg.ReceiptHandle, function(err) {
          if (err)
            console.error('Failed to delete msg ' + msg.ReceiptHandle + ' : ' + err);
        });
      }
    } else if (err) {
      console.log('sqs.receiveCallback: ' + err);
    }

    self.timer = setTimeout(self.receiveStart, 500);
  };
}

module.exports = new SQSWorker();
