'use strict';

angular.module('SecretSantaApp.controllers', [])
  .controller('detailsController', function($scope) {
    $scope.title = '';
    $scope.cashAmount = 0;
    $scope.cashCurrency = 'gbp';
  })
  .controller('namesController', function($scope) {

  });
  // .controller('namesController', function($scope, $compile) {
  //   $scope.people = [];
  //   $scope.newPerson = {};

  //   $scope.addPerson = function() {
  //     var el;
  //     $scope.people.push($scope.newPerson);
  //     $scope.newPerson = {};
  //     $('.names-container').append(
  //       $compile('<div data-person />')($scope)
  //     );
  //   };
  // });
