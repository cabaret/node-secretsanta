'use strict';

angular.module('SecretSantaApp.controllers', [])
.controller('eventController', function($scope, emailAPIService, _) {

  $scope.event = {
    title: null,
    cashAmount: 15,
    cashCurrency: 'eur',
    date: new Date("2013-12-25T00:00:00.000Z"),
    message: '',
    valid: false
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
    'title': 'Please provide an event title.',
    'people': 'Please add at least 3 people',
    'exists': 'Already on the list',
    'noexist': 'One of the addresses does not exist',
    'ok': 'Send to santa!'
  }

  $scope.currentError = $scope.errors.title;

  $scope.checkErrors = function(detailsForm, people) {
    if(! $scope.event.title) {
      $scope.currentError = $scope.errors.title;
      $scope.valid = false;
    } else if($scope.people.length < 3) {
      $scope.currentError = $scope.errors.people;
      $scope.valid = false;
    } else if(detailsForm.$valid && people.length >= 3) {
      var valid = true;
      for(var i = 0; i < people.length; i++) {
        if(people[i].valid == false) {
          valid = false;
        } else if(people[i].valid == null) {
          valid = false;
        } else {
          valid = true;
        }
      }
      $scope.valid = valid;
      if( ! $scope.valid) {
        $scope.currentError = $scope.errors.noexist;
      } else {
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

  $scope.addPerson = function(person) {
    var emailExists = null,
        person = $scope.newPerson;

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
    return $scope.checkErrors(detailsForm, people);
  };

  // $scope.submitEvent = function() {
  //   var postData = {};

  //   window._gaq.push(['_trackEvent', 'sendNames', 'clickSubmit']);

  //   _.extend(postData, { event: $scope.event }, { people: $scope.people });
  //   emailAPIService.postEmails(postData, function(data) {
  //     console.log(data.success);
  //     if(data.success) {
  //       $scope.people = [];
  //       $scope.newPerson = {};
  //       $scope.event = {
  //         title: null,
  //         cashAmount: 15,
  //         cashCurrency: 'eur',
  //         date: new Date("2013-12-25T00:00:00.000Z"),
  //         message: ''
  //       };
  //     }
  //   });
  // };


  /* TODO: figure out where to put this */
  $('#github').on('click', function() {
    window._gaq.push(['_trackEvent', 'link', 'github-fork']);
  });

  $('a[class^="seeger-"], a[class^=joris-').on('click', function() {
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
