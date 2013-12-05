'use strict';

angular.module('SecretSantaApp.services', [])
  .factory('emailAPIService', function($http) {
    var emailAPIService = {};

    emailAPIService.checkEmail = function(data, callback) {
      var email = { "email": data };
      $http.post('/checkEmail', email)
        .success(function(res) {
          callback(res);
        });
    }

    emailAPIService.postEmails = function(data, callback) {

    };

    return emailAPIService;
  });
