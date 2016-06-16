"use strict";

userApp.controller('MessageCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, 'mailbox/inbox') + getNavbar(mailLinks, 'mailbox/' + session.get('mailbox'));
      $http.get('/api/message/' + $routeParams.mid).success(function (data) {
         $scope.messages = data.msgs;
         $scope.replyTo = data.replyTo;
      });
      $scope.deletePM = function (index) {
         var msgs = $scope.messages;
         var answer = confirm(index === 0 ? '整个对话的所有消息将被删除？' : '此条消息将被删除？');
         if (answer) {
            $http.get('/api/message/' + msgs[index].id + '?action=delete').success(function (data) {
               if (validateResponse(data)) {
                  if (index === 0) {
                     $location.path('/mailbox/' + session.get('mailbox'));
                  }
                  else {
                     msgs.splice(index, 1);
                     $scope.messages = msgs;
                  }
               }
            });
         }
      };
      $scope.reply = function () {
         var msg = $scope.replyBody;
         if (msg.length < 5) {
            alert('短信内容最少为5个字符');
            return;
         }
         $http.post('/api/message?action=post', 'toUID=' + $scope.replyTo.id + '&body=' + encodeURIComponent(msg) + '&topicMID=' + $routeParams.mid, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               $scope.messages.push(data);
            }
         });
         $scope.replyBody = null;
      };
   }]);

