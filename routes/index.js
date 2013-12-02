
/*
 * GET home page.
 */

var _ = require('underscore');


exports.index = function(env) {
  return function(req, res) {
    res.render('index', { title: 'node-secretsanta', env: env });
  }
};

exports.handleEmails = function(req, res) {
  var postData = req.body,
      mailData = {}, secretSanta;
  console.log(postData);
  mailData.event = postData.event;

  secretSanta = (function() {
    var len = postData.people.length, i;
    for(i = 0; i < len; i++) {
      _.sample(postData.people)
    }
  })();

  console.log(mailData);
  res.json(mailData);
}

