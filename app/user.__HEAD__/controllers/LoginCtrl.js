"use strict";

userApp.controller('LoginCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      if ($cookies.LZXSID === cache.get('sessionID') && cache.get('uid') > 0) {
         $location.path('/profile');
         return;
      }

      $scope.navbar = getNavbar(guestLinks, $location.path().substring(1));

      $scope.login = function (username, password) {
         $http.post('/api/authentication?action=post', 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               if (data.sessionID) {
                  cache.set('sessionID', data.sessionID);
                  cache.set('uid', data.uid);
                  if (data.uid > 0) {
                     cache.set('username', data.username);
                     cache.set('role', data.role);
                  }
               }
               else {
                  alert('对话加载失败');
               }
            }

            var redirect = session.get('redirect');
            if (redirect) {
               session.remove('redirect');
               if (redirect.substring(0, 4) === 'http') {
                  window.location.href = redirect;
               }
               else {
                  $location.path(redirect);
               }
            }
            else {
               $location.path('/profile');
            }
         });
      };
   }]);

