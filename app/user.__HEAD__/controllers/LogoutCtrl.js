"use strict";

userApp.controller('LogoutCtrl', ['$http', '$cookies', '$location', function ($http, $cookies, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         $location.path('/login');
         return;
      }

      // need a setTimeout, otherwise there request will be sent twice, weird bug!
      setTimeout(function () {
         $http.get('/api/authentication/' + cache.get('sessionID') + '?action=delete').success(function (data) {
            if (validateResponse(data)) {
               cache.remove('sessionID');
               $location.path('/login');
            }
         });
      }, 1);
   }]);

