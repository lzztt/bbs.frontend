"use strict";

var userLinks = [
   {name: "首页", uri: "/"},
   {name: "我的账户", uri: "profile"},
   {name: "短信", uri: "mailbox/inbox"},
   {name: "收藏夹", uri: "bookmark"},
   {name: "登出", uri: "logout"}
];

var guestLinks = [
   {name: "首页", uri: "/"},
   {name: "登录", uri: "login"},
   {name: "忘记密码", uri: "forget_password"},
   {name: "忘记用户名", uri: "forget_username"},
   {name: "注册帐号", uri: "register"}
];

var mailLinks = [
   {name: "收件箱", uri: "mailbox/inbox"},
   {name: "发件箱", uri: "mailbox/sent"}
];

var userApp = angular.module('userApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

userApp.directive('pager', ngPagerDirective);
userApp.directive('contenteditable', ngEditableDirective);

userApp.run(['$templateCache', '$route', '$http', function ($templateCache, $route, $http) {
      ngCacheTemplates(userApp, '__HEAD__', $templateCache, $route, $http);
   }]);

userApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .when('/', {
             redirectTo: '/profile'
          })
          .when('/mailbox/:folder', {
             templateUrl: '/app/user.__HEAD__/views/mailbox.html',
             controller: 'MailboxCtrl'
          })
          .when('/pm/:mid', {
             templateUrl: '/app/user.__HEAD__/views/message.html',
             controller: 'MessageCtrl'
          })
          .when('/bookmark', {
             templateUrl: '/app/user.__HEAD__/views/bookmark.html',
             controller: 'BookmarkCtrl'
          })
          .when('/profile', {
             templateUrl: '/app/user.__HEAD__/views/profile.html',
             controller: 'ProfileCtrl'
          })
          .when('/profile/:uid', {
             templateUrl: '/app/user.__HEAD__/views/profile.html',
             controller: 'ProfileCtrl'
          })
          .when('/login', {
             controller: 'LoginCtrl',
             templateUrl: '/app/user.__HEAD__/views/login.html'
          })
          .when('/logout', {
             controller: 'LogoutCtrl',
             template: ''
          })
          .when('/register', {
             controller: 'RegisterCtrl',
             templateUrl: '/app/user.__HEAD__/views/register.html'
          })
          .when('/forget_password', {
             controller: 'ForgetPasswordCtrl',
             templateUrl: '/app/user.__HEAD__/views/forget_password.html'
          })
          .when('/set_password', {
             controller: 'SetPasswordCtrl',
             templateUrl: '/app/user.__HEAD__/views/set_password.html'
          })
          .when('/forget_username', {
             controller: 'ForgetUsernameCtrl',
             templateUrl: '/app/user.__HEAD__/views/forget_username.html'
          })
          .when('/sendpm/:uid', {
             controller: 'SendPMCtrl',
             templateUrl: '/app/user.__HEAD__/views/message.html'
          })
          .otherwise({
             template: '404 page not found :(',
          });
   }]);
