'use strict';

angular.module('SecretSantaApp.controllers', [])
.controller('eventController', function($scope, emailAPIService, _) {

  $scope.event = {
    title: null,
    cashAmount: 15,
    cashCurrency: 'eur',
    date: new Date("2013-12-25T00:00:00.000Z"),
    message: '',
    valid: false,
    organiser: {
      name: null,
      email: null
    }
  }
  $scope.people = [];
  $scope.newPerson = {};

  $scope.slider = {
    options: {
      orientation: 'horizontal',
      min: '0',
      max: '100',
      range: 'min'
    }
  }

  $scope.errors = {
    'organiserName': 'Please provide an organiser name',
    'organiserEmail': 'Please provide an organiser email',
    'title': 'Please provide an event title.',
    'people': 'Please add at least 3 people',
    'exists': 'Already on the list',
    'noexist': 'One of the addresses does not exist',
    'checking': 'The elves are verifying the addresses',
    'ok': 'Send to santa!'
  }

  $scope.currentError = $scope.errors.title;

  $scope.checkErrors = function(detailsForm, people) {
    if(! $scope.event.organiser.name) {
      $scope.currentError = $scope.errors.organiserName;
      $scope.valid = false;
    } else if( ! $scope.event.organiser.email) {
      $scope.currentError = $scope.errors.organiserEmail;
      $scope.valid = false;
    } else if(! $scope.event.title) {
      $scope.currentError = $scope.errors.title;
      $scope.valid = false;
    } else if($scope.people.length < 3) {
      $scope.currentError = $scope.errors.people;
      $scope.valid = false;
    } else if(($scope.detailsForm && $scope.detailsForm.$valid) && $scope.people.length >= 3) {
      var valid = true;
      for(var i = 0; i < $scope.people.length; i++) {
        if($scope.people[i].valid == null) {
          $scope.currentError = $scope.errors.checking;
          valid = false;
        } else if($scope.people[i].valid == false) {
          $scope.currentError = $scope.errors.noexist;
          valid = false;
        } else {
          valid = true;
        }
      }
      $scope.valid = valid;
      if($scope.valid) {
        $scope.currentError = $scope.errors.ok;
      }
    }

    return $scope.valid;
  };

  $scope.alreadyAdded = function(email) {
    var alreadyAdded = false;
    if($scope.people.length >= 1) {
      for(var idx in $scope.people) {
        if(_.contains($scope.people[idx], email)) {
          alreadyAdded = true;
        }
      }
    }
    return alreadyAdded;
  }

  $scope.checkEmail = function(email, idx) {
    emailAPIService.checkEmail(email, function(data) {
      if(data.success != true) {
        $scope.people[idx].valid = false;
      } else {
        $scope.people[idx].valid = true;
      }
    });

  };

  $scope.checkOrganiser = function(detailsForm) {
    if($scope.event.organiser.name && $scope.event.organiser && detailsForm.organiserEmail.$valid && detailsForm.organiserName.$valid) {
      var person = {
        name: $scope.event.organiser.name,
        email: $scope.event.organiser.email,
        organiser: true
      };

      var hasOrganiser = false, idx;
      for(var i = 0; i < $scope.people.length; i++) {
        if(_.has($scope.people[i], 'organiser')) {
          hasOrganiser = true;
          idx = i;
        }
      }

      if( ! _.contains($scope.people, person) && ! hasOrganiser) {
        $scope.addPerson(person);
      } else {
        $scope.people.splice(idx, 1);
        $scope.addPerson(person);
      }
    };
  };

  $scope.addPerson = function(person) {
    window._gaq.push(['_trackEvent', 'addPerson', 'clickAddPerson']);

    var person = person || $scope.newPerson

    if($scope.alreadyAdded(person.email)) {
      $scope.currentError = $scope.errors.exists;
      $scope.newPerson = {};
    } else {
      $scope.people.push(person);
      $scope.newPerson = {};
      var idx = $scope.people.indexOf(person);
      $scope.checkEmail(person.email, idx);
    }
  };

  $scope.removePerson = function(index) {
    $scope.people.splice(index, 1);
    $scope.checkErrors();
  };

  $scope.validateEvent = function(detailsForm, people) {
    $scope.detailsForm = detailsForm;
    return $scope.checkErrors($scope.detailsForm, people);
  };

  $scope.submitEvent = function() {
    var postData = {};

    window._gaq.push(['_trackEvent', 'sendNames', 'clickSubmit']);

    _.extend(postData, { event: $scope.event }, { people: $scope.people });
    emailAPIService.postEmails(postData, function(data) {
      if(data.success) {
        $scope.people = [];
        $scope.newPerson = {};
        $scope.event = {
          title: null,
          cashAmount: 15,
          cashCurrency: 'eur',
          date: new Date("2013-12-25T00:00:00.000Z"),
          message: '',
          organiser: {
            name: null,
            email: null
          }
        }
        $('.submit__btn-submit').hide();
        $('.people').slideUp(1000, function() {
          $('.details').slideUp(1000, function() {
            $('.memo').outerHeight($('.memo').outerHeight() + 30);
            $('.memo .container').fadeOut(function() {
              var html  = "<p class='col-xs-12 memo__letter'>";
                html += "<span class='headline'>Thanks for helping Santa out!</span>"
                html += "We hope you will have an amazing party! <br>Merry Christmas!<br><br>"
                html += "Santa's little helpers"
                html += "</p>";
              $('.memo .container').html(html).fadeIn();;
            });
          });
        });
      }
    });
  };


  /* TODO: figure out where to put this */
  $('#github').on('click', function() {
    window._gaq.push(['_trackEvent', 'link', 'github-fork']);
  });

  $('a[class^="seeger-"], a[class^="joris-"]').on('click', function() {
    window._gaq.push(['_trackEvent', 'link', $(this).attr('class')]);
  });

  var body = document.body,
  timer;

  window.addEventListener('scroll', function() {
    clearTimeout(timer);
    if(!body.classList.contains('disable-hover')) {
      body.classList.add('disable-hover')
    }

    var timer = setTimeout(function(){
      body.classList.remove('disable-hover')
    },500);
  }, false);

  $('.slider').slider();
  /* /TODO */
});
