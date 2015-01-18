var tplVersion = '__HEAD__';

var adLinks = [
   {name: "首页", uri: "/"},
   {name: "我的账户", uri: "/app/user/profile"},
   {name: "广告汇总", uri: "summary"},
   {name: "添加广告", uri: "add"},
   {name: "添加付款", uri: "payment"}
];

var session = {
   set: function (key, value) {
      if (value == null) {
         sessionStorage.removeItem(key);
      }
      else {
         sessionStorage.setItem(key, JSON.stringify(value));
      }
   },
   get: function (key) {
      var value = sessionStorage.getItem(key);
      if (value == null) {
         return null;
      }
      else {
         return JSON.parse(value);
      }
   },
   remove: function (key) {
      sessionStorage.removeItem(key);
   },
   clear: function () {
      sessionStorage.clear();
   }
};

var cache = {
   set: function (key, value) {
      if (value == null) {
         localStorage.removeItem(key);
      }
      else {
         localStorage.setItem(key, JSON.stringify(value));
      }
   },
   get: function (key) {
      var value = localStorage.getItem(key);
      if (value == null) {
         return null;
      }
      else {
         return JSON.parse(value);
      }
   },
   remove: function (key) {
      localStorage.removeItem(key);
   },
   clear: function () {
      localStorage.clear();
   }
};

var getNavbar = function (links, activeLink) {
   var html = '<nav class="navbar">';
   for (var i = 0; i < links.length; i++) {
      if (activeLink !== links[i].uri) {
         html = html + '<a href="' + links[i].uri + '">' + links[i].name + '</a>';
      }
      else {
         html = html + '<a class="active" href="' + links[i].uri + '">' + links[i].name + '</a>';
      }
   }
   return html + '</nav>';
};

var validateResponse = function (data) {
   if (!data) {
      alert('服务器没有响应');
      return false;
   }
   else {
      if (data.error) {
         alert(data.error);
         return false;
      }
   }
   return true;
};

var cacheApp = angular.module('cacheApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

cacheApp.run(['$templateCache', '$route', '$http', '$cookies', function ($templateCache, $route, $http, $cookies) {
      if (!isNaN(tplVersion) && parseInt(tplVersion) > 0) {
         // enable cache for a numbered version
         var tplCacheRefresh = (tplVersion != cache.get(cacheApp.name + '_tplVersion'));
         if (tplCacheRefresh) {
            cache.set(cacheApp.name + '_tplVersion', tplVersion);
         }

         for (var path in $route.routes)
         {
            var tplUrl = $route.routes[path].templateUrl;
            if (tplUrl)
            {
               var tplCache = tplUrl.replace('.' + tplVersion, '');
               // is it already loaded?
               var html = tplCacheRefresh ? null : localStorage.getItem(tplCache);

               // load the template and cache it 
               if (!html) {
                  $http.get(tplUrl).success(function (data, status, headers, config) {
                     var tplUrl = config.url;
                     var tplCache = tplUrl.replace('.' + tplVersion, '');
                     // template loaded from the server
                     localStorage.setItem(tplCache, data);
                     $templateCache.put(tplUrl, data);
                  });
               } else {
                  // inject the template
                  $templateCache.put(tplUrl, html);
               }
            }
         }
      }
   }]);

cacheApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .when('/', {
             redirectTo: '/home'
          })
          .when('/home', {
             templateUrl: '/app/cache.__HEAD__/cache.tpl.html',
             controller: 'CacheCtrl'
          })
          .otherwise({
             template: '404 page not found :('
          });
   }]);

cacheApp.controller('CacheCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', window.location.href);
         window.location.href = '/app/user/login';
         return;
      }

      if (cache.get('uid') != 1) {
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
      }

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
