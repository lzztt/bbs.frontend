"use strict";

userApp.controller('MailboxCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, 'mailbox/inbox') + getNavbar(mailLinks, 'mailbox/' + $routeParams.folder);
      session.set('mailbox', $routeParams.folder);
      $scope.goToPage = function (i) {
         $http.get('/api/message/' + $routeParams.folder + '?p=' + i).success(function (data) {
            if (validateResponse(data)) {
               $scope.mailbox = data;
               if (data.pager && data.pager.pageCount > 1) {
                  $scope.pageCount = data.pager.pageCount;
                  $scope.pageCurrent = data.pager.pageNo;
               }
            }
         });
      };
      $scope.goToPage(1);
   }]);

