
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
     request = require('request'),
     inspect = require('util').inspect,
     querystring = require('querystring'),
     url = require('url'),
     q = require('q'),
     app, ga;

 app = express();

 process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});

 if(app.get('env') == 'production') {
  require('newrelic');
}

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

app.post('/email', function(req, res) {
  var data = req.body,
      _err = {
        errors: [],
        success: false
      },
      _res = res,
      checkEmail;

  checkEmail = function(email) {
    var deferred = q.defer();
    var options = {
      url: 'https://api.mailgun.net/v2/address/validate',
      method: 'GET',
      qs: {address: email },
      encoding: 'ASCII',
      auth: {
        username: "api",
        password: process.env.MAILGUN_PUB
      }
    };
    request(options, function(err, res) {
      deferred.resolve(JSON.parse(res.request.response.body).is_valid);
    });

    return deferred.promise;
  }

  checkEmail(data.email)
    .then(
      function(is_valid) {
        if(! is_valid) {
          _err.success = false;
          _err.errors.push({
            error: is_valid,
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

app.post('/emails', function(req, res) {
  var postData = req.body,
      mailData = {},
      errors, date, i;

  mailData.event = postData.event;
  date = new Date(postData.event.date);
  mailData.event.date = date.toLocaleDateString('en-us', { month: 'long' });

  mailData.matches = secretSanta(postData.people);
  emailTemplates(templatesDir, function(err, template) {
    if(err) {
      console.log(err);
    } else {
      var options = {
        url: 'https://api.mailgun.net/v2/memofromsanta.com/messages',
        method: 'POST',
        auth: {
          username: 'api',
          password: process.env.MAILGUN_KEY
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };

      var Render = function(santaEvent, locals) {
        this.locals = locals;
        this.locals.event = santaEvent;
        var _this = this;
        this.send = function(err, html, text) {
          if (err) {
            console.log(err);
            } else {
              var body = {
                to: _this.locals.from.name + ' <' + _this.locals.from.email + '>',
                from: 'Santa Claus <santa@memofromsanta.com>',
                html: html,
                text: text,
                subject: 'Christmas Party: ' + _this.locals.event.title
              };
              options.body = querystring.stringify(body);
              request(options, function(err, res) {
                if(err) {
                  console.log(err);
                }
              });

              // transportBatch.sendMail({
              //   from: 'Santa Claus <santa@memofromsanta.com>',
              //   to: _this.locals.from.email,
              //   subject: 'Christmas Party: ' + _this.locals.event.title,
              //   html: html,
              //   generateTextFromHTML: true
              // }, function(err, responseStatus) {
              //   if (err) {
              //     console.log(err);
              //   } else {
              //     console.log(responseStatus.message);
              //   }
              // });
            }
          };
          this.batch = function(batch) {
            batch(this.locals, templatesDir, this.send);
          };
        };
        template('invitation', true, function(err, batch) {
          for(var match in mailData.matches) {
            var render = new Render(mailData.event, mailData.matches[match]);
            render.batch(batch);
          }
        });
      }
  });
  res.json({ success: true });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
