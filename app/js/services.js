'use strict';

angular.module('SecretSantaApp.services', [])
  .factory('emailAPIService', function($http) {
    var emailAPIService = {};

    emailAPIService.checkEmail = function(data, callback) {
      var email = { "email": data };
      $http.post('/email', email)
        .success(function(res) {
          callback(res);
        });
    }

    emailAPIService.postEmails = function(data, callback) {
      if(data.people.length >= 3) {
        $http.post('/emails', data)
          .success(function(res) {
            callback(res);
          });
      }
    };

    return emailAPIService;
  });
