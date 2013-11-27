'use strict';

angular.module('SecretSantaApp.controllers', [])
  .controller('detailsController', function($scope) {
    $scope.event = {
      title: '',
      cashAmount: 15,
      cashCurrency: 'eur',
      message: ''
    }
  })
  .controller('namesController', function($scope) {
    $scope.people = [];
    $scope.newPerson = {};

    $scope.addPerson = function(person) {
      $scope.people.push(person);
      $scope.newPerson = {};
    };

    $scope.removePerson = function(index) {
      $scope.people.splice(index, 1);
    };
  });
