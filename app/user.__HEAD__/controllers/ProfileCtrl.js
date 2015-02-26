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
            $scope.birthday = new Date(data.birthday * 1000);

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

      $scope.editMode = false;
      var userBackup;

      $scope.edit = function () {
         $scope.editMode = true;
         userBackup = JSON.parse(JSON.stringify($scope.user));
      };

      $scope.save = function () {
         if ($scope.editMode) {
            if ($scope.user.birthday * 1000 !== $scope.birthday.getTime()) {
               $scope.user.birthday = new Date($scope.birthday).getTime() / 1000;
            }
            // check if we have update values
            // submit the update values to server
            /*
             $http.get('/api/user/' + nid.substring(0, nid.length - 1) + '?action=put').success(function (data) {
             if (validateResponse(data)) {
             $scope.editMode = false;
             }
             });*/

            $scope.editMode = false;
         }
         else {
            $scope.editMode = false;
         }
      };

      $scope.cancel = function () {
         $scope.user = userBackup;
         $scope.editMode = false;
      };
   }]);

