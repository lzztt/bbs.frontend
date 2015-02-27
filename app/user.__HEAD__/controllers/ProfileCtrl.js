"use strict";

userApp.controller('ProfileCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      var uid = $routeParams.uid ? parseInt($routeParams.uid) : cache.get('uid');
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

      $scope.editMode = false;
      var userBackup;

      $scope.edit = function () {
         $scope.editMode = true;
         userBackup = JSON.parse(JSON.stringify($scope.user));
         $scope.birthday = new Date($scope.user.birthday * 1000);
      };

      $scope.save = function () {
         if ($scope.editMode) {
            if ($scope.user.birthday * 1000 !== $scope.birthday.getTime()) {
               $scope.user.birthday = new Date($scope.birthday).getTime() / 1000;
            }
            // check if we have update values      
            var updates = "";
            for (var i in $scope.user) {
               if ($scope.user[i] !== userBackup[i]) {
                  switch (typeof ($scope.user[i])) {
                     case "string":
                        updates = updates + encodeURIComponent(i) + "=" + encodeURIComponent($scope.user[i]) + "&";
                        break;
                     case "number":
                        updates = updates + encodeURIComponent(i) + "=" + $scope.user[i] + "&";
                        break;
                     default:
                  }
               }
            }

            if (updates.length > 0) {
               // submit the update values to server
               $http.post('/api/user/' + $scope.user.id + '?action=put', updates.substring(0, updates.length - 1), {
                  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
                  if (validateResponse(data)) {
                     $scope.editMode = false;
                     alert("您的信息已更新");
                  }
               });
            }
            else {
               $scope.editMode = false;
            }
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

