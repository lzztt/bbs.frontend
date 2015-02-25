"use strict";

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

var ngCacheTemplates = function (app, tplVersion, $templateCache, $route, $http) {
   if (!isNaN(tplVersion) && parseInt(tplVersion) > 0) {
      // enable cache for a numbered version
      var tplCacheRefresh = (tplVersion != cache.get(app.name + '_tplVersion'));
      if (tplCacheRefresh) {
         cache.set(app.name + '_tplVersion', tplVersion);
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
};

var ngPagerDirective = function () {
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
};