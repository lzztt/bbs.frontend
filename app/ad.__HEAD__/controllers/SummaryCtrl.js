"use strict";

adApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', window.location.href);
         window.location.href = '/app/user/login';
         return;
      }

      if (cache.get('uid') !== 1) {
         $location.path('/forbidden');
      }

      $scope.navbar = getNavbar(adLinks, $location.path().substring(1));
      $http.get('/api/ad').success(function (data) {
         if (validateResponse(data)) {
            $scope.ads = data;
         }
      });
      $http.get('/api/adpayment').success(function (data) {
         if (validateResponse(data)) {
            $scope.payments = data;
         }
      });

   }]);
