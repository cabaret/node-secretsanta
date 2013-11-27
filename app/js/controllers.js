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

    $scope.submitEvent = function() {
      var postData = {};

      _.extend(postData, $scope.event, $scope.people);
      postData.people = $scope.people;

      emailAPIService.postEmails(postData);
    };
  });
