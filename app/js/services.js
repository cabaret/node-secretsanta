'use strict';

angular.module('SecretSantaApp.services', [])
  .factory('emailAPIService', function($http) {
    var emailAPIService = {};

    emailAPIService.postEmails = function(data) {
      $http.post('/handleEmails', data).
        success(function(res) {
          console.log(res);
        });
    };

    return emailAPIService;
  });
