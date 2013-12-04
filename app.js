
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
 emails, secretSanta, app, ga;

 app = express();

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
  app.set('mailOptions', {
    host:  'localhost',
    port:  '25',
    from:  'santa@memofromsanta.com'
  });
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



app.post('/handleEmails', function(req, res) {
  var postData = req.body,
      mailData = {};

  mailData.event = postData.event;
  mailData.matches = secretSanta(postData.people);

  console.log(mailData);
  res.json(mailData);

  // emailTemplates(templatesDir, function(err, template) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     var transport = nodemailer.createTransport("SMTP", {
  //       service: 'Mailgun',
  //       auth: {
  //         user: process.env.MAILGUN_USER,
  //         pass: process.env.MAILGUN_PASS
  //       }
  //     });

  //     var locals = {
  //       email: 'info@jorisooms.be',
  //       name: 'Joris',
  //       buyFor: 'seegje',
  //       event: {
  //         date: '25 dec 2013',
  //         cash: '15 EUR',
  //         name: 'Partijtje'
  //       }
  //     };

  //     template('invitation', locals, function(err, html, text) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         emailExistence.check(locals.email, function(err, res) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             transport.sendMail({
  //               from: 'Santa Claus <santa@memofromsanta.com>',
  //               to: locals.email,
  //               subject: 'Party: ' + locals.event.name,
  //               html: html,
  //               generateTextFromHTML: true,
  //               text: text
  //             }, function(err, responseStatus) {
  //               if (err) {
  //                 console.log(err);
  //               } else {
  //                 console.log(responseStatus.message);
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }
  // });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
