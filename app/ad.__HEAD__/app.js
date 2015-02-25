"use strict";

var adLinks = [
   {name: "首页", uri: "/"},
   {name: "我的账户", uri: "/app/user/profile"},
   {name: "广告汇总", uri: "summary"},
   {name: "添加广告", uri: "add"},
   {name: "添加付款", uri: "payment"}
];

var adApp = angular.module('adApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

adApp.directive('pager', ngPagerDirective);

adApp.run(['$templateCache', '$route', '$http', function ($templateCache, $route, $http) {
      ngCacheTemplates(adApp, '__HEAD__', $templateCache, $route, $http);
   }]);

adApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .when('/', {
             redirectTo: '/summary'
          })
          .when('/summary', {
             templateUrl: '/app/ad.__HEAD__/views/summary.html',
             controller: 'SummaryCtrl'
          })
          .when('/payment', {
             templateUrl: '/app/ad.__HEAD__/views/add_payment.html',
             controller: 'PaymentCtrl'
          })
          .when('/add', {
             controller: 'AddCtrl',
             templateUrl: '/app/ad.__HEAD__/views/add_ad.html'
          })
          .otherwise({
             template: '404 page not found :('
          });
   }]);
