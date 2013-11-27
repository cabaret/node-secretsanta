'use strict';

angular.module('SecretSantaApp.services', [])
  .factory('emailAPIService', function($http) {
    var emailAPIService = {};

    emailAPIService.postEmails = function(data) {
      $http.post('/handleEmails', data).
        success(function(response) {
          console.log(response);
        });
    };

    return emailAPIService;
  });
