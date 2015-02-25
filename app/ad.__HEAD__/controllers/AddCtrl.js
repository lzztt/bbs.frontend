"use strict";

adApp.controller('AddCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', window.location.href);
         window.location.href = '/app/user/login';
         return;
      }

      if (cache.get('uid') !== 1) {
         $location.path('/forbidden');
      }

      $scope.navbar = getNavbar(adLinks, $location.path().substring(1));
      $scope.addAd = function () {
         $http.post('/api/ad?action=post', 'name=' + encodeURIComponent($scope.name) + '&email=' + encodeURIComponent($scope.email) + '&type_id=' + $scope.type_id, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert('广告添加成功:' + data.name + ' : ' + data.email);
            }
         });
      };
   }]);