'use strict';

angular.module('SecretSantaApp.services', [])
  .factory('emailAPIService', function($http) {
    var emailAPIService = {};

    emailAPIService.postEmails = function(data) {
      $http.post('/handleEmails', data).
        success(function(res) {
          for(var i = 0; i < res.length; i++) {
            console.log(res[i].from.name + " (" +res[i].from.email + ") will buy a present for " + res[i].to.name + " (" + res[i].to.email + ")");
          }
          console.log('----');
        });
    };

    return emailAPIService;
  });
