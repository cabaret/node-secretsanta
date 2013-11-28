'use strict';

angular.module('SecretSantaApp.controllers', [])
  .controller('eventController', function($scope, emailAPIService, _) {
    $scope.event = {
      title: '',
      cashAmount: 15,
      cashCurrency: 'eur',
      message: ''
    }
    $scope.people = [];
    $scope.newPerson = {};

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
