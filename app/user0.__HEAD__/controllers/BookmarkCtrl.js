"use strict";

userApp.controller('BookmarkCtrl', ['$scope', '$cookies', '$http', '$location', function ($scope, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, $location.path().substring(1));

      $scope.goToPage = function (i) {
         $http.get('/api/bookmark/' + cache.get('uid') + '?p=' + i).success(function (data) {
            $scope.nodes = data.nodes;
            if (data.pager && data.pager.pageCount > 1)
            {
               $scope.pageCount = data.pager.pageCount;
               $scope.pageCurrent = data.pager.pageNo;
            }
         });
      };

      $scope.goToPage(1);

      var deletedBookmarks = [];
      $scope.editMode = false;

      $scope.edit = function () {
         $scope.editMode = true;
         deletedBookmarks = [];
      };

      $scope.save = function () {
         if ($scope.editMode) {
            if (deletedBookmarks.length) {
               var index, nid = '';
               for (var i = 0; i < deletedBookmarks.length; i++) {
                  nid += deletedBookmarks[i].id + ',';
               }

               $http.get('/api/bookmark/' + nid.substring(0, nid.length - 1) + '?action=delete').success(function (data) {
                  if (validateResponse(data)) {
                     $scope.editMode = false;
                  }
               });
            }
            else {
               $scope.editMode = false;
            }
         }
         deletedBookmarks = [];
      };

      $scope.cancel = function () {
         $scope.editMode = false;
         deletedBookmarks = [];
      };

      $scope.deleteBookmark = function (index) {
         var nodes = $scope.nodes;
         deletedBookmarks.push(nodes[index]);
         nodes.splice(index, 1);
         $scope.nodes = nodes;
      };
   }]);
