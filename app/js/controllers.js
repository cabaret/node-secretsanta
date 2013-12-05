'use strict';

angular.module('SecretSantaApp.controllers', [])
  .controller('eventController', function($scope, emailAPIService, _) {

    $scope.event = {
      title: null,
      cashAmount: 15,
      cashCurrency: 'eur',
      date: new Date("2013-12-25T00:00:00.000Z"),
      message: ''
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
      'noexist': 'E-mail address does not exist',
      'ok': 'Send to santa!'
    }

    $scope.currentError = $scope.errors.title;

    $scope.checkErrors = function() {
      if(! $scope.event.title) {
        $scope.currentError = $scope.errors.title;
      } else if($scope.people.length < 3) {
        $scope.currentError = $scope.errors.people;
      } else {
        $scope.currentError = $scope.errors.ok;
      }
    };

    $scope.addPerson = function(person) {
      var alreadyAdded = false, emailExists = null,
          person = $scope.newPerson;
      if($scope.people.length >= 1) {
        for(var idx in $scope.people) {
          if(_.contains($scope.people[idx], person.email)) {
            alreadyAdded = true;
          }
        }
      }
      if(alreadyAdded) {
        $scope.currentError = $scope.errors.exists;
        $scope.newPerson = {};
      } else {
        $scope.people.push(person);
        $scope.newPerson = {};
        $scope.checkErrors();
        var idx = $scope.people.indexOf(person);
        emailAPIService.checkEmail(person.email, function(data) {
          if(data.success != true) {
            $scope.people[idx].valid = false;
          } else {
            $scope.people[idx].valid = true;
          }
        });
      }
    };

    $scope.removePerson = function(index) {
      $scope.people.splice(index, 1);
    };

    $scope.validateEvent = function(detailsForm, people) {
      if(detailsForm.$valid && people.length >= 3) {
        var res = true;
        for(var person in people) {
          if( ! person.valid) {
            res = false
          }
        }
        return res;
      } else {
        return false;
      }
    };

    $scope.submitEvent = function() {
      var postData = {};

      // window._gaq.push(['_trackEvent', 'sendNames', 'clickSubmit']);

      _.extend(postData, { event: $scope.event }, { people: $scope.people });
      // emailAPIService.postEmails(postData, function(data) {
      //   console.log(data.success);
      //   if(data.success) {
      //     $scope.people = [];
      //     $scope.newPerson = {};
      //     $scope.event = {
      //       title: null,
      //       cashAmount: 15,
      //       cashCurrency: 'eur',
      //       date: new Date("2013-12-25T00:00:00.000Z"),
      //       message: ''
      //     };
      //     (function() {
      //       $('.submit').hide(function() {
      //         $('.people').slideUp(function() {
      //           $('.details').slideUp();
      //         });
      //       });
      //     })();
      //   }

      // });
    };


    /* TODO: figure out where to put this */
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
