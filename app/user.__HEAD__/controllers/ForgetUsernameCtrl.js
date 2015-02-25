"use strict";

userApp.controller('ForgetUsernameCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      $scope.navbar = getNavbar(guestLinks, $location.path().substring(1));

      $scope.updateCaptcha = function () {
         $scope.captchaURI = '/api/captcha/' + Math.random().toString().slice(2);
      };
      
      $scope.updateCaptcha();

      $scope.sendUsername = function () {
         $http.post('/api/username?action=post', 'email=' + encodeURIComponent($scope.email) + '&captcha=' + encodeURIComponent($scope.captcha), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert("用户名已经成功发送到您的注册邮箱 " + $scope.email + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
            }
         });
      };
   }]);

