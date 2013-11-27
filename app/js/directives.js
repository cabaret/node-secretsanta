'use strict';

angular.module('SecretSantaApp.directives', [])
  .directive('person', function() {
    return {
      restrict: 'A',
      templateUrl: '/js/directives/person.html'
    }
  });
