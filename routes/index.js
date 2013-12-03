
/*
 * GET home page.
 */

var _ = require('underscore');


exports.index = function(env, ga) {
  return function(req, res) {
    res.render('index', { title: 'A memo from Santa!', env: env, ga: ga });
  }
};
