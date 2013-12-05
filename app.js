
/**
 * Module dependencies.
 */

 var express = require('express'),
     routes = require('./routes'),
     http = require('http'),
     path = require('path'),
     _ = require('underscore'),
     nodemailer = require('nodemailer'),
     emailTemplates = require('email-templates'),
     templatesDir = path.resolve(__dirname, '.', 'templates'),
     emailExistence = require('email-existence'),
     q = require('q'),
     app, ga;

 app = express();


ga = {
  code: process.env.GA_CODE,
  url: process.env.GA_URL
};

app.configure(function(){
  app.set('port', process.env.PORT || 3005);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(path.join(__dirname, 'app/img/favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'app')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index(app.get('env'), ga));

secretSanta = function(data) {
  var givers = data,
  takers = _.clone(givers),
  matches = [],
  i;

  for(i = 0; i < data.length; i++) {
    // can probably be done way better but hey, quick hack for now..
    var tmpGivers, tmpTakers, giver, taker;
    tmpGivers = _.clone(givers);
    tmpTakers = _.clone(takers);
    giver = _.sample(tmpGivers);
    tmpTakers = _.without(tmpTakers, giver);
    taker = _.sample(tmpTakers);
    takers = _.without(takers, taker);
    givers = _.without(givers, giver);
    takers.push(giver);

    matches.push({
      from: giver,
      to: taker
    });
  }

  return matches;
};

app.post('/checkEmail', function(req, res) {
  var data = req.body,
      _err = {
        errors: [],
        success: false
      },
      _res = res,
      checkEmail;

  checkEmail = function(email) {
    var deferred = q.defer();
    emailExistence.check(email, function(err, res) {
        deferred.resolve(err, res);
    });
    return deferred.promise;
  }

  checkEmail(data.email)
    .then(
      function(err, res) {
        console.log(err, res);
        if(err) {
          _err.success = false;
          _err.errors.push({
            error: err,
            message: 'E-mail address does not exist: ' + data.email
          });
        } else {
          _err.success = true;
          _res.json(_err);
        }
        _res.json(_err);
      }
    );
});




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
