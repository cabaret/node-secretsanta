'use strict';

angular.module('SecretSantaApp.directives', [])
  .directive('person', function() {
    return {
      restrict: 'E',
      templateUrl: '/js/directives/person.html'
    }
  });
