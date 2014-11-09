var userLinks = [
   {name: "用户首页", uri: "#/profile"},
   {name: "站内短信", uri: "#/mailbox/inbox"},
   {name: "收藏夹", uri: "#/bookmark"}
];

var mailLinks = [
   {name: "收件箱", uri: "#/mailbox/inbox"},
   {name: "发件箱", uri: "#/mailbox/sent"}
];

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

var inboxApp = angular.module('inboxApp', ['ngSanitize', 'ngRoute', 'ngCookies']);

inboxApp.config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/mailbox/:folder', {
             templateUrl: 'inboxView.html',
             controller: 'InboxCtrl'
          }).
          when('/pm/:mid', {
             templateUrl: 'messageView.html',
             controller: 'MessageCtrl'
          }).
          when('/bookmark', {
             templateUrl: 'bookmarkView.html',
             controller: 'BookmarkCtrl'
          }).
          when('/profile', {
             templateUrl: 'profileView.html',
             controller: 'ProfileCtrl'
          }).
          otherwise({
             redirectTo: '/profile'
          });
   }]);

inboxApp.directive('pager', function () {
   return {
      restrict: 'A',
      scope: {
         pcurrent: '=',
         pcount: '=',
         paction: '&'
      },
      template: '<a href="" ng-repeat="p in pages" ng-click="paction({i:p.id})" ng-class="{active: p.active}">{{p.name}}</a>',
      link: function (scope, element, attrs) {
         //console.log(element);
         //console.log(attrs);
         //console.log(scope);
         scope.$watch('pcurrent', function () {
            var pFirst, pLast,
                pCurrent = parseInt(scope.pcurrent),
                pCount = parseInt(scope.pcount);
            //console.log(pCurrent);
            //console.log(pCount);

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
            //console.log(scope.pages);
         });
      }
   }
});
inboxApp.controller('InboxCtrl', function ($scope, $routeParams, $cookies, $http, $location) {
   $scope.navbar = getNavbar(userLinks, '#/mailbox/inbox') + getNavbar(mailLinks, '#/mailbox/' + $routeParams.folder);
   $cookies.mailbox = $routeParams.folder;
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
});
inboxApp.controller('MessageCtrl', function ($scope, $routeParams, $cookies, $http, $location) {
   $scope.navbar = getNavbar(userLinks, '#/mailbox/inbox') + getNavbar(mailLinks, '#/mailbox/' + $cookies.mailbox);
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
               $location.path('/mailbox/' + $cookies.mailbox);
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
});
inboxApp.controller('BookmarkCtrl', function ($scope, $routeParams, $cookies, $http, $location) {
   $scope.navbar = getNavbar(userLinks, '#' + $location.path());

   $scope.goToPage = function (i) {
      $http.get('/api/bookmark/' + $cookies.uid + '?p=' + i).success(function (data) {
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
});
inboxApp.controller('ProfileCtrl', function ($scope, $cookies, $http, $location) {
   $scope.navbar = getNavbar(userLinks, '#' + $location.path());
   $http.get('/api/user/' + $cookies.uid).success(function (data) {
      $scope.user = data;
   });
});