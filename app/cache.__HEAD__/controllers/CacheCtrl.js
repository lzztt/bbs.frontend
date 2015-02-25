cacheApp.controller('CacheCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID !== cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', window.location.href);
         window.location.href = '/app/user/login';
         return;
      }

      if (cache.get('uid') !== 1) {
         $location.path('/forbidden');
      }

      var currentDir = '';

      $scope.onClick = function (index) {
         var file = $scope.files[index];
         if (!file) {
            alert("wrong file");
            return;
         }
         if (file.indexOf(".") >= 0) {
            // cache file, delete
            var answer = confirm("您确认要删除缓存文件 " + file + " 吗？");
            if (answer)
            {

               $http.get('/api/cache' + currentDir + '/' + encodeURIComponent(file.substring(0, file.indexOf('.'))) + '?action=delete').success(function (data) {
                  if (validateResponse(data)) {
                     var files = $scope.files;
                     files.splice(index, 1);
                     $scope.files = files;
                  }
               });
            }
            return;
         }
         else {
            // cache directory, list
            var newDir;
            if (file === '__PARENT__') {
               if (currentDir) {
                  newDir = currentDir.substring(0, currentDir.lastIndexOf('/'));
                  if (newDir === '/') {
                     newDir = '';
                  }
               }
               else {
                  // cannot go up further
                  return;
               }
            }
            else {
               newDir = currentDir + '/' + file;
            }

            $http.get('/api/cache' + newDir).success(function (data) {
               if (validateResponse(data)) {
                  data.splice(data.indexOf('.'), 1);
                  data.splice(data.indexOf('..'), 1);
                  data.unshift('__PARENT__');
                  $scope.files = data;
                  currentDir = newDir;
                  $scope.currentDir = currentDir;
               }
            });
         }
      };

      // load cache root dir
      $http.get('/api/cache').success(function (data) {
         if (validateResponse(data)) {
            data.splice(data.indexOf('.'), 1);
            data.splice(data.indexOf('..'), 1);
            data.unshift('__PARENT__');
            $scope.files = data;
            $scope.currentDir = currentDir;
         }
      });

   }]);
