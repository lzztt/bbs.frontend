"use strict";

userApp.controller('SendPMCtrl', ['$scope', '$http', '$cookies', '$location', '$routeParams', function ($scope, $http, $cookies, $location, $routeParams) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      var user = session.get('pmUser');
      if (!user || user.id !== $routeParams.uid) {
         $location.path('/page_not_found');
         return;
      }

      $scope.navbar = getNavbar(userLinks, 'mailbox/inbox') + getNavbar(mailLinks, 'mailbox/sent');
      $scope.messages = [];
      $scope.replyTo = user;

      $scope.reply = function () {
         var msg = $scope.replyBody;
         if (msg.length < 5) {
            alert('短信内容最少为5个字符');
            return;
         }
         $http.post('/api/message?action=post', 'toUID=' + $scope.replyTo.id + '&body=' + encodeURIComponent(msg), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               $location.path('/pm/' + data.mid);
            }
         });
         $scope.replyBody = null;
      };
   }]);