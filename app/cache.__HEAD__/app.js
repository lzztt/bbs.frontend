var adLinks = [
   {name: "首页", uri: "/"},
   {name: "我的账户", uri: "/app/user/profile"},
   {name: "广告汇总", uri: "summary"},
   {name: "添加广告", uri: "add"},
   {name: "添加付款", uri: "payment"}
];

var cacheApp = angular.module('cacheApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

cacheApp.run(['$templateCache', '$route', '$http', function ($templateCache, $route, $http) {
      ngCacheTemplates(cacheApp, '__HEAD__', $templateCache, $route, $http);
   }]);

cacheApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .when('/', {
             redirectTo: '/home'
          })
          .when('/home', {
             templateUrl: '/app/cache.__HEAD__/views/cache.html',
             controller: 'CacheCtrl'
          })
          .otherwise({
             template: '404 page not found :('
          });
   }]);
