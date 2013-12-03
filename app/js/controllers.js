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
      $scope.people.push(person);
      $scope.checkErrors();
      $scope.newPerson = {};
    };

    $scope.removePerson = function(index) {
      $scope.people.splice(index, 1);
    };

    $scope.validateEvent = function(detailsForm, people) {
      if(detailsForm.$valid && people.length >= 3) {
        return true;
      } else {
        return false;
      }
    };

    $scope.submitEvent = function() {
      var postData = {};

      // window._gaq.push(['_trackEvent', 'sendNames', 'clickSubmit']);

      _.extend(postData, { event: $scope.event }, { people: $scope.people });
      emailAPIService.postEmails(postData);
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
