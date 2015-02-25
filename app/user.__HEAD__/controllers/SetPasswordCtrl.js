"use strict";

userApp.controller('SetPasswordCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      if (!session.get('identCodePath')) {
         $location.path('/register');
      }

      $scope.navbar = getNavbar(guestLinks, session.get('identCodePath').substring(1));

      $scope.requestIdentCode = function () {
         $location.path(session.get('identCodePath'));
      };

      $scope.setPassword = function () {
         $http.post('/api/user/' + $scope.identCode + '?action=put', 'password=' + encodeURIComponent($scope.password), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert("您的新密码已经设置成功");
            }
         });
      };
   }]);

