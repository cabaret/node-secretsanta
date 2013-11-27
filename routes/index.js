
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'node-secretsanta' });
};

exports.handleEmails = function(req, res) {
  console.log(req.body);
  res.json(req.body);
}
