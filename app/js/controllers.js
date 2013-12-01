'use strict';

angular.module('SecretSantaApp.controllers', [])
  .controller('eventController', function($scope, emailAPIService, _) {
    $('.slider').slider()

    $scope.event = {
      title: '',
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

    $scope.addPerson = function(person) {
      $scope.people.push(person);
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

      _.extend(postData, { event: $scope.event }, { people: $scope.people });
      emailAPIService.postEmails(postData);
    };
  });
