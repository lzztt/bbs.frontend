"use strict";

adApp.controller('PaymentCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', window.location.href);
         window.location.href = '/app/user/login';
         return;
      }

      if (cache.get('uid') !== 1) {
         $location.path('/forbidden');
      }

      $scope.navbar = getNavbar(adLinks, $location.path().substring(1));
      $http.get('/api/ad/name').success(function (data) {
         if (validateResponse(data)) {
            $scope.ads = data;
         }
      });

      $scope.time = new Date();
      $scope.ad_time = 3;

      $scope.addPayment = function () {
         var date = $scope.time.getFullYear() + '-' + ($scope.time.getMonth() + 1) + '-' + $scope.time.getDate();
         $http.post('/api/adpayment', 'ad_id=' + $scope.ad.id + '&amount=' + $scope.amount + '&time=' + date + '&ad_time=' + $scope.ad_time + '&comment=' + encodeURIComponent($scope.comment), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               var expDate = new Date(data.expTime * 1000);
               var expTime = expDate.getFullYear() + '-' + (expDate.getMonth() + 1) + '-' + expDate.getDate();
               alert('付款添加成功:' + data.adName + ' : $' + data.amount + '\n广告有效期更新至: ' + expTime);
            }
         });
      };
   }]);

