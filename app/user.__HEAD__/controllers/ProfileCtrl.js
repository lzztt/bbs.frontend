"use strict";

userApp.controller('ProfileCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      var uid = $routeParams.uid ? $routeParams.uid : cache.get('uid');
      $scope.navbar = getNavbar(userLinks, $location.path().substring(1));
      $http.get('/api/user/' + uid).success(function (data) {
         if (validateResponse(data)) {
            $scope.user = data;

            if (cache.get('uid') === 1 && uid !== 1) {
               $scope.isAdmin = true;
               $scope.deleteUser = function () {
                  var answer = confirm('此操作不可恢复，确认删除此用户: ' + $scope.user.username + ' (' + uid + ')?');
                  if (answer) {
                     $http.get('/api/user/' + uid + '?action=delete').success(function (data) {
                        if (validateResponse(data)) {
                           alert('用户 ' + $scope.user.username + ' ID: ' + uid + ' 已经从系统中删除。');
                        }
                     });
                  }
               };
            }

            var avatar = data.avatar ? data.avatar : '/data/avatars/avatar0' + Math.ceil(Math.random() * 5) + '.jpg';
            if (uid === cache.get('uid')) {
               $scope.isSelf = true;
               // jquery avatar uploader
               $('.imgCropper').imageCropper({windowWidth: 120, windowHeight: 120, uploadURL: '/api/user/' + uid + '?action=put', uploadName: 'avatar', defaultImage: avatar});
            }
            else {
               $('.imgCropper').append('<img src="' + avatar + '">');
               $scope.isSelf = false;
               $scope.showSendPM = function () {
                  session.set('pmUser', {id: uid, username: data.username});
                  $location.path('/sendpm/' + uid);
               };
            }
         }
      });
   }]);

