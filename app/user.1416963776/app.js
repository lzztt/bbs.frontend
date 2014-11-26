var tplVersion = '1416963776';

var userLinks = [
   {name: "用户首页", uri: "#/profile"},
   {name: "站内短信", uri: "#/mailbox/inbox"},
   {name: "收藏夹", uri: "#/bookmark"},
   {name: "登出", uri: "#/logout"},
   {name: "网站首页", uri: "/"}
];

var mailLinks = [
   {name: "收件箱", uri: "#/mailbox/inbox"},
   {name: "发件箱", uri: "#/mailbox/sent"}
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

var userApp = angular.module('userApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

userApp.run(['$templateCache', '$route', '$http', function ($templateCache, $route, $http) {
      var tplCacheRefresh = (tplVersion != cache.get(userApp.name + '_tplVersion'));
      if (tplCacheRefresh) {
         cache.set(userApp.name + '_tplVersion', tplVersion);
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
   }]);

userApp.config(['$routeProvider', function ($routeProvider) {
      $routeProvider
          .when('/mailbox/:folder', {
             templateUrl: '/app/user.1416963776/mailbox.tpl.html',
             controller: 'MailboxCtrl'
          })
          .when('/pm/:mid', {
             templateUrl: '/app/user.1416963776/message.tpl.html',
             controller: 'MessageCtrl'
          })
          .when('/bookmark', {
             templateUrl: '/app/user.1416963776/bookmark.tpl.html',
             controller: 'BookmarkCtrl'
          })
          .when('/profile', {
             templateUrl: '/app/user.1416963776/profile.tpl.html',
             controller: 'ProfileCtrl'
          })
          .when('/login', {
             controller: 'LoginCtrl',
             templateUrl: '/app/user.1416963776/login.tpl.html'
          })
          .when('/logout', {
             controller: 'LogoutCtrl',
             template: ''
          })
          .otherwise({
             redirectTo: '/profile'
          });
   }]);

userApp.directive('pager', function () {
   return {
      restrict: 'A',
      scope: {
         pcurrent: '=',
         pcount: '=',
         paction: '&'
      },
      template: '<a href="" ng-repeat="p in pages" ng-click="paction({i:p.id})" ng-class="{active: p.active}">{{p.name}}</a>',
      link: function (scope, element, attrs) {
         scope.$watch('pcurrent', function () {
            var pFirst, pLast,
                pCurrent = parseInt(scope.pcurrent),
                pCount = parseInt(scope.pcount);

            // validate pCount and pCurrent
            if (isNaN(pCount) || pCount <= 1)
               return;
            if (isNaN(pCurrent) || pCurrent < 1 || pCurrent > pCount)
               pCurrent = 1;
            // calculate pFirst, pLast
            if (pCount <= 7) {
               pFirst = 1;
               pLast = pCount;
            }
            else {
               pFirst = pCurrent - 3;
               pLast = pCurrent + 3;
               if (pFirst < 1) {
                  pFirst = 1;
                  pLast = 7;
               }
               else if (pLast > pCount) {
                  pFirst = pCount - 6;
                  pLast = pCount;
               }
            }

            // build page list
            scope.pages = [];
            if (pFirst < pLast) {
               if (pFirst > 1) {
                  scope.pages.push({id: 1, name: '<<'});
                  scope.pages.push({id: pCurrent - 1, name: '<'});
               }
               for (var i = pFirst; i <= pLast; i++) {
                  if (i !== pCurrent)
                  {
                     scope.pages.push({id: i, name: i});
                  }
                  else
                  {
                     scope.pages.push({id: i, name: i, active: true});
                  }
               }
               if (pLast < pCount) {
                  scope.pages.push({id: pCurrent + 1, name: '>'});
                  scope.pages.push({id: pCount, name: '>>'});
               }
            }
         });
      }
   }
});

userApp.controller('MailboxCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, '#/mailbox/inbox') + getNavbar(mailLinks, '#/mailbox/' + $routeParams.folder);
      session.set('mailbox', $routeParams.folder);
      $scope.goToPage = function (i) {
         $http.get('/api/message/' + $routeParams.folder + '?p=' + i).success(function (data) {
            $scope.mailbox = data;
            if (data.pager && data.pager.pageCount > 1)
            {
               $scope.pageCount = data.pager.pageCount;
               $scope.pageCurrent = data.pager.pageNo;
            }
         });
      };
      $scope.goToPage(1);
   }]);

userApp.controller('MessageCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, '#/mailbox/inbox') + getNavbar(mailLinks, '#/mailbox/' + session.get('mailbox'));
      $http.get('/api/message/' + $routeParams.mid).success(function (data) {
         $scope.messages = data.msgs;
         $scope.replyTo = data.replyTo;
         $scope.topicMID = $routeParams.mid;
      });
      $scope.deletePM = function (index) {
         var msgs = $scope.messages;
         $http.get('/api/message/' + msgs[index].id + '?action=delete').success(function (data) {
            if (data && data.error)
            {
               alert(data.error);
            }
            else
            {
               if (index == 0)
               {
                  $location.path('/mailbox/' + session.get('mailbox'));
               }
               else
               {
                  msgs.splice(index, 1);
                  $scope.messages = msgs;
               }
            }
         });
      };
      $scope.reply = function () {
         var msg = $scope.replyBody;
         if (msg.length < 5) {
            alert('短信内容最少为5个字符');
            return;
         }
         $http.post('/api/message?action=post', 'toUID=' + $scope.replyTo.id + '&body=' + encodeURIComponent(msg) + '&topicMID=' + $scope.topicMID, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (!data) {
               alert('服务器没有响应');
            }
            else {
               if (data.error) {
                  alert(data.error);
               }
               else {
                  $scope.messages.push(data);
               }
            }
         });
         $scope.replyBody = null;
      }
   }]);

userApp.controller('BookmarkCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, '#' + $location.path());

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

      var actions = ["编辑", "保存"];
      var deletedBookmarks = [];
      $scope.editMode = false;
      $scope.action = actions[0];

      $scope.toggleAction = function () {
         if ($scope.editMode) {
            if (deletedBookmarks.length) {
               var index, nid = '';
               for (var i = 0; i < deletedBookmarks.length; i++) {
                  nid += deletedBookmarks[i].id + ',';
               }

               $http.get('/api/bookmark/' + nid.substring(0, nid.length - 1) + '?action=delete').success(function (data) {
                  if (data && data.error) {
                     alert(data.error);
                  }
                  else {
                     $scope.editMode = false;
                     $scope.action = actions[0];
                  }
               });
            }
            else {
               $scope.editMode = false;
               $scope.action = actions[0];
            }
         }
         else {
            $scope.editMode = true;
            $scope.action = actions[1];
         }

         deletedBookmarks = [];
      };


      $scope.deleteBookmark = function (index) {
         var nodes = $scope.nodes;
         deletedBookmarks.push(nodes[index]);
         nodes.splice(index, 1);
         $scope.nodes = nodes;
      };
   }]);

userApp.controller('ProfileCtrl', ['$scope', '$cookies', '$http', '$location', function ($scope, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, '#' + $location.path());
      $http.get('/api/user/' + cache.get('uid')).success(function (data) {
         $scope.user = data;
      });
   }]);

userApp.controller('LoginCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      if ($cookies.LZXSID == cache.get('sessionID') && cache.get('uid') > 0) {
         $location.path('/profile');
         return;
      }

      $scope.login = function (username, password) {
         $http.post('/api/authentication?action=post', 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (!data) {
               alert('服务器没有响应');
            }
            else {
               if (data.sessionID) {
                  cache.set('sessionID', data.sessionID);
                  cache.set('uid', data.uid);
                  if (data.uid > 0) {
                     cache.set('username', data.username);
                     cache.set('role', data.role);
                  }
               }
               else {
                  if (data.error) {
                     alert(data.error);
                  }
                  else {
                     alert('对话加载失败');
                  }
               }
            }
            $location.path('/profile');
         });
      };
   }]);

userApp.controller('LogoutCtrl', ['$http', '$cookies', '$location', function ($http, $cookies, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         $location.path('/login');
         return;
      }

      // need a setTimeout, otherwise there request will be sent twice, weird bug!
      setTimeout(function () {
         $http.get('/api/authentication/' + cache.get('sessionID') + '?action=delete').success(function (data) {
            if (data && data.error) {
               alert(data.error);
            }
            else {
               cache.remove('sessionID');
               $location.path('/login');
            }
         });
      }, 1);
   }]);