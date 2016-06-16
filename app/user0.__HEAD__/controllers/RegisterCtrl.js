"use strict";

userApp.controller('RegisterCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      $scope.navbar = getNavbar(guestLinks, $location.path().substring(1));

      $scope.updateCaptcha = function () {
         $scope.captchaURI = '/api/captcha/' + Math.random().toString().slice(2);
      };
      $scope.updateCaptcha();

      $scope.register = function () {
         var email = $scope.email;
         if (email !== $scope.email2)
         {
            alert("两次输入的邮箱不一致，请检查");
            return;
         }

         $http.post('/api/user?action=post', 'username=' + encodeURIComponent($scope.username) + '&email=' + encodeURIComponent(email) + '&captcha=' + encodeURIComponent($scope.captcha), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert("感谢注册！账户激活\n安全验证码已经成功发送到您的注册邮箱 " + $scope.email + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
               session.set('identCodePath', $location.path());
               $location.path('/set_password');
            }
         });
      };
   }]);

