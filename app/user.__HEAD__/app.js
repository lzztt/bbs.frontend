var tplVersion = '__HEAD__';

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

var userApp = angular.module('userApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

userApp.run(['$templateCache', '$route', '$http', function ($templateCache, $route, $http) {
      if (!isNaN(tplVersion) && parseInt(tplVersion) > 0) {
         // enable cache for a numbered version
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
      }
   }]);

userApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .when('/', {
             redirectTo: '/profile'
          })
          .when('/mailbox/:folder', {
             templateUrl: '/app/user.__HEAD__/mailbox.tpl.html',
             controller: 'MailboxCtrl'
          })
          .when('/pm/:mid', {
             templateUrl: '/app/user.__HEAD__/message.tpl.html',
             controller: 'MessageCtrl'
          })
          .when('/bookmark', {
             templateUrl: '/app/user.__HEAD__/bookmark.tpl.html',
             controller: 'BookmarkCtrl'
          })
          .when('/profile', {
             templateUrl: '/app/user.__HEAD__/profile.tpl.html',
             controller: 'ProfileCtrl'
          })
          .when('/profile/:uid', {
             templateUrl: '/app/user.__HEAD__/profile.tpl.html',
             controller: 'ProfileCtrl'
          })
          .when('/login', {
             controller: 'LoginCtrl',
             templateUrl: '/app/user.__HEAD__/login.tpl.html'
          })
          .when('/logout', {
             controller: 'LogoutCtrl',
             template: ''
          })
          .when('/register', {
             controller: 'RegisterCtrl',
             templateUrl: '/app/user.__HEAD__/register.tpl.html'
          })
          .when('/forget_password', {
             controller: 'ForgetPasswordCtrl',
             templateUrl: '/app/user.__HEAD__/forget_password.tpl.html'
          })
          .when('/set_password', {
             controller: 'SetPasswordCtrl',
             templateUrl: '/app/user.__HEAD__/set_password.tpl.html'
          })
          .when('/forget_username', {
             controller: 'ForgetUsernameCtrl',
             templateUrl: '/app/user.__HEAD__/forget_username.tpl.html'
          })
          .otherwise({
             template: '404 page not found :(',
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
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, 'mailbox/inbox') + getNavbar(mailLinks, 'mailbox/' + $routeParams.folder);
      session.set('mailbox', $routeParams.folder);
      $scope.goToPage = function (i) {
         $http.get('/api/message/' + $routeParams.folder + '?p=' + i).success(function (data) {
            if (validateResponse(data)) {
               $scope.mailbox = data;
               if (data.pager && data.pager.pageCount > 1) {
                  $scope.pageCount = data.pager.pageCount;
                  $scope.pageCurrent = data.pager.pageNo;
               }
            }
         });
      };
      $scope.goToPage(1);
   }]);

userApp.controller('MessageCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      $scope.navbar = getNavbar(userLinks, 'mailbox/inbox') + getNavbar(mailLinks, 'mailbox/' + session.get('mailbox'));
      $http.get('/api/message/' + $routeParams.mid).success(function (data) {
         $scope.messages = data.msgs;
         $scope.replyTo = data.replyTo;
      });
      $scope.deletePM = function (index) {
         var msgs = $scope.messages;
         $http.get('/api/message/' + msgs[index].id + '?action=delete').success(function (data) {
            if (validateResponse(data)) {
               if (index == 0) {
                  $location.path('/mailbox/' + session.get('mailbox'));
               }
               else {
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
         $http.post('/api/message?action=post', 'toUID=' + $scope.replyTo.id + '&body=' + encodeURIComponent(msg) + '&topicMID=' + $routeParams.mid, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               $scope.messages.push(data);
            }
         });
         $scope.replyBody = null;
      }
   }]);

userApp.controller('BookmarkCtrl', ['$scope', '$cookies', '$http', '$location', function ($scope, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
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

userApp.controller('ProfileCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', $location.path());
         $location.path('/login');
         return;
      }

      var uid = $routeParams.uid ? $routeParams.uid : cache.get('uid');
      $scope.navbar = getNavbar(userLinks, $location.path().substring(1));
      $http.get('/api/user/' + uid).success(function (data) {
         if (validateResponse(data)) {
            $scope.user = data;

            // jquery avatar uploader
            $('.imgCropper').imageCropper({windowWidth: 120, windowHeight: 120, uploadURL: '/api/user/' + uid + '?action=put', uploadName: 'avatar', defaultImage: data.avatar});
         }
      });
   }]);

userApp.controller('LoginCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      if ($cookies.LZXSID == cache.get('sessionID') && cache.get('uid') > 0) {
         $location.path('/profile');
         return;
      }

      $scope.navbar = getNavbar(guestLinks, $location.path().substring(1));

      $scope.login = function (username, password) {
         $http.post('/api/authentication?action=post', 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               if (data.sessionID) {
                  cache.set('sessionID', data.sessionID);
                  cache.set('uid', data.uid);
                  if (data.uid > 0) {
                     cache.set('username', data.username);
                     cache.set('role', data.role);
                  }
               }
               else {
                  alert('对话加载失败');
               }
            }

            var redirect = session.get('redirect');
            if (redirect) {
               session.remove('redirect');
               if (redirect.substring(0, 4) == 'http') {
                  window.location.href = redirect;
               }
               else {
                  $location.path(redirect);
               }
            }
            else {
               $location.path('/profile');
            }
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
            if (validateResponse(data)) {
               cache.remove('sessionID');
               $location.path('/login');
            }
         });
      }, 1);
   }]);


userApp.controller('RegisterCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      $scope.navbar = getNavbar(guestLinks, $location.path().substring(1));

      $scope.updateCaptcha = function () {
         $scope.captchaURI = '/api/captcha/' + Math.random().toString().slice(2);
      }
      $scope.updateCaptcha();

      $scope.register = function () {
         var email = $scope.email;
         if (email != $scope.email2)
         {
            alert("两次输入的邮箱不一致，请检查");
            return;
         }

         $http.post('/api/user?action=post', 'username=' + encodeURIComponent($scope.username) + '&email=' + encodeURIComponent(email) + '&captcha=' + encodeURIComponent($scope.captcha), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert("感谢注册！账户激活\n安全验证码已经成功发送到您的注册邮箱 " + $scope.email + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
               session.set('identCodePath', $location.path());
               $location.path('/set_password');
            }
         });
      };
   }]);

userApp.controller('ForgetPasswordCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      $scope.navbar = getNavbar(guestLinks, $location.path().substring(1));

      $scope.updateCaptcha = function () {
         $scope.captchaURI = '/api/captcha/' + Math.random().toString().slice(2);
      }
      $scope.updateCaptcha();

      $scope.forgetPassword = function () {
         $http.post('/api/identificationcode?action=post', 'username=' + encodeURIComponent($scope.username) + '&email=' + encodeURIComponent($scope.email) + '&captcha=' + encodeURIComponent($scope.captcha), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert("安全验证码已经成功发送到您的注册邮箱 " + $scope.email + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
               session.set('identCodePath', $location.path());
               $location.path('/set_password');
            }
         });
      };
   }]);

userApp.controller('SetPasswordCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      if (!session.get('identCodePath')) {
         $location.path('/register');
      }

      $scope.navbar = getNavbar(guestLinks, session.get('identCodePath').substring(1));

      $scope.requestIdentCode = function () {
         $location.path(session.get('identCodePath'));
      };

      $scope.setPassword = function () {
         $http.post('/api/user/' + $scope.identCode + '?action=put', 'password=' + encodeURIComponent($scope.password), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert("您的新密码已经设置成功");
            }
         });
      };
   }]);

userApp.controller('ForgetUsernameCtrl', ['$scope', '$http', '$cookies', '$location', function ($scope, $http, $cookies, $location) {
      $scope.navbar = getNavbar(guestLinks, $location.path().substring(1));

      $scope.updateCaptcha = function () {
         $scope.captchaURI = '/api/captcha/' + Math.random().toString().slice(2);
      }
      $scope.updateCaptcha();

      $scope.sendUsername = function () {
         $http.post('/api/username?action=post', 'email=' + encodeURIComponent($scope.email) + '&captcha=' + encodeURIComponent($scope.captcha), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert("用户名已经成功发送到您的注册邮箱 " + $scope.email + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
            }
         });
      };
   }]);