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

var adApp = angular.module('adApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

adApp.run(['$templateCache', '$route', '$http', function ($templateCache, $route, $http) {
      if (!isNaN(tplVersion) && parseInt(tplVersion) > 0) {
         // enable cache for a numbered version
         var tplCacheRefresh = (tplVersion != cache.get(adApp.name + '_tplVersion'));
         if (tplCacheRefresh) {
            cache.set(adApp.name + '_tplVersion', tplVersion);
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

adApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .when('/', {
             redirectTo: '/summary'
          })
          .when('/summary', {
             templateUrl: '/app/ad.__HEAD__/summary.tpl.html',
             controller: 'SummaryCtrl'
          })
          .when('/payment', {
             templateUrl: '/app/ad.__HEAD__/add_payment.tpl.html',
             controller: 'PaymentCtrl'
          })
          .when('/add', {
             controller: 'AddCtrl',
             templateUrl: '/app/ad.__HEAD__/add_ad.tpl.html'
          })
          .otherwise({
             template: '404 page not found :('
          });
   }]);

adApp.directive('pager', function () {
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

adApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', window.location.href);
         window.location.href = '/app/user/login';
         return;
      }

      if (cache.get('uid') != 1) {
         $location.path('/forbidden');
      }

      $scope.navbar = getNavbar(adLinks, $location.path().substring(1));
      $http.get('/api/ad').success(function (data) {
         if (validateResponse(data)) {
            $scope.ads = data;
         }
      });
      $http.get('/api/adpayment').success(function (data) {
         if (validateResponse(data)) {
            $scope.payments = data;
         }
      });

   }]);

adApp.controller('PaymentCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', window.location.href);
         window.location.href = '/app/user/login';
         return;
      }

      if (cache.get('uid') != 1) {
         $location.path('/forbidden');
      }

      $scope.navbar = getNavbar(adLinks, $location.path().substring(1));
      $http.get('/api/ad/name').success(function (data) {
         if (validateResponse(data)) {
            $scope.ads = data;
         }
      });

      $scope.time = new Date();
      $scope.ad_time = 3;

      $scope.addPayment = function () {
         var date = $scope.time.getFullYear() + '-' + ($scope.time.getMonth() + 1) + '-' + $scope.time.getDate();
         $http.post('/api/adpayment?action=post', 'ad_id=' + $scope.ad.id + '&amount=' + $scope.amount + '&time=' + date + '&ad_time=' + $scope.ad_time + '&comment=' + encodeURIComponent($scope.comment), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               var expDate = new Date(data.expTime * 1000);
               var expTime = expDate.getFullYear() + '-' + (expDate.getMonth() + 1) + '-' + expDate.getDate();
               alert('付款添加成功:' + data.adName + ' : $' + data.amount + '\n广告有效期更新至: ' + expTime);
            }
         });
      }
   }]);

adApp.controller('AddCtrl', ['$scope', '$routeParams', '$cookies', '$http', '$location', function ($scope, $routeParams, $cookies, $http, $location) {
      if (!$cookies.LZXSID || $cookies.LZXSID != cache.get('sessionID') || !cache.get('uid')) {
         session.set('redirect', window.location.href);
         window.location.href = '/app/user/login';
         return;
      }

      if (cache.get('uid') != 1) {
         $location.path('/forbidden');
      }

      $scope.navbar = getNavbar(adLinks, $location.path().substring(1));
      $scope.addAd = function () {
         $http.post('/api/ad?action=post', 'name=' + encodeURIComponent($scope.name) + '&email=' + encodeURIComponent($scope.email) + '&type_id=' + $scope.type_id, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function (data) {
            if (validateResponse(data)) {
               alert('广告添加成功:' + data.name + ' : ' + data.email);
            }
         });
      }
   }]);