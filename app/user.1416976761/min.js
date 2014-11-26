var tplVersion="1416976761";var userLinks=[{name:"用户首页",uri:"#/profile"},{name:"站内短信",uri:"#/mailbox/inbox"},{name:"收藏夹",uri:"#/bookmark"},{name:"登出",uri:"#/logout"},{name:"网站首页",uri:"/"}];var mailLinks=[{name:"收件箱",uri:"#/mailbox/inbox"},{name:"发件箱",uri:"#/mailbox/sent"}];var session={set:function(a,b){if(b==null){sessionStorage.removeItem(a)}else{sessionStorage.setItem(a,JSON.stringify(b))}},get:function(a){var b=sessionStorage.getItem(a);if(b==null){return null}else{return JSON.parse(b)}},remove:function(a){sessionStorage.removeItem(a)},clear:function(){sessionStorage.clear()}};var cache={set:function(a,b){if(b==null){localStorage.removeItem(a)}else{localStorage.setItem(a,JSON.stringify(b))}},get:function(a){var b=localStorage.getItem(a);if(b==null){return null}else{return JSON.parse(b)}},remove:function(a){localStorage.removeItem(a)},clear:function(){localStorage.clear()}};var getNavbar=function(a,d){var c='<nav class="navbar">';for(var b=0;b<a.length;b++){if(d!==a[b].uri){c=c+'<a href="'+a[b].uri+'">'+a[b].name+"</a>"}else{c=c+'<a class="active" href="'+a[b].uri+'">'+a[b].name+"</a>"}}return c+"</nav>"};var userApp=angular.module("userApp",["ngSanitize","ngRoute","ngCookies"]);userApp.run(["$templateCache","$route","$http",function(a,h,g){var d=(tplVersion!=cache.get(userApp.name+"_tplVersion"));if(d){cache.set(userApp.name+"_tplVersion",tplVersion)}for(var e in h.routes){var b=h.routes[e].templateUrl;if(b){var f=b.replace("."+tplVersion,"");var c=d?null:localStorage.getItem(f);if(!c){g.get(b).success(function(l,i,n,k){var j=k.url;var m=j.replace("."+tplVersion,"");localStorage.setItem(m,l);a.put(j,l)})}else{a.put(b,c)}}}}]);userApp.config(["$routeProvider",function(a){a.when("/mailbox/:folder",{templateUrl:"/app/user.1416976761/mailbox.tpl.html",controller:"MailboxCtrl"}).when("/pm/:mid",{templateUrl:"/app/user.1416976761/message.tpl.html",controller:"MessageCtrl"}).when("/bookmark",{templateUrl:"/app/user.1416976761/bookmark.tpl.html",controller:"BookmarkCtrl"}).when("/profile",{templateUrl:"/app/user.1416976761/profile.tpl.html",controller:"ProfileCtrl"}).when("/login",{controller:"LoginCtrl",templateUrl:"/app/user.1416976761/login.tpl.html"}).when("/logout",{controller:"LogoutCtrl",template:""}).otherwise({redirectTo:"/profile"})}]);userApp.directive("pager",function(){return{restrict:"A",scope:{pcurrent:"=",pcount:"=",paction:"&"},template:'<a href="" ng-repeat="p in pages" ng-click="paction({i:p.id})" ng-class="{active: p.active}">{{p.name}}</a>',link:function(c,b,a){c.$watch("pcurrent",function(){var g,f,h=parseInt(c.pcurrent),d=parseInt(c.pcount);if(isNaN(d)||d<=1){return}if(isNaN(h)||h<1||h>d){h=1}if(d<=7){g=1;f=d}else{g=h-3;f=h+3;if(g<1){g=1;f=7}else{if(f>d){g=d-6;f=d}}}c.pages=[];if(g<f){if(g>1){c.pages.push({id:1,name:"<<"});c.pages.push({id:h-1,name:"<"})}for(var e=g;e<=f;e++){if(e!==h){c.pages.push({id:e,name:e})}else{c.pages.push({id:e,name:e,active:true})}}if(f<d){c.pages.push({id:h+1,name:">"});c.pages.push({id:d,name:">>"})}}})}}});userApp.controller("MailboxCtrl",["$scope","$routeParams","$cookies","$http","$location",function(a,c,b,e,d){if(!b.LZXSID||b.LZXSID!=cache.get("sessionID")||!cache.get("uid")){session.set("redirect",d.path());d.path("/login");return}a.navbar=getNavbar(userLinks,"#/mailbox/inbox")+getNavbar(mailLinks,"#/mailbox/"+c.folder);session.set("mailbox",c.folder);a.goToPage=function(f){e.get("/api/message/"+c.folder+"?p="+f).success(function(g){a.mailbox=g;if(g.pager&&g.pager.pageCount>1){a.pageCount=g.pager.pageCount;a.pageCurrent=g.pager.pageNo}})};a.goToPage(1)}]);userApp.controller("MessageCtrl",["$scope","$routeParams","$cookies","$http","$location",function(a,c,b,e,d){if(!b.LZXSID||b.LZXSID!=cache.get("sessionID")||!cache.get("uid")){session.set("redirect",d.path());d.path("/login");return}a.navbar=getNavbar(userLinks,"#/mailbox/inbox")+getNavbar(mailLinks,"#/mailbox/"+session.get("mailbox"));e.get("/api/message/"+c.mid).success(function(f){a.messages=f.msgs;a.replyTo=f.replyTo;a.topicMID=c.mid});a.deletePM=function(f){var g=a.messages;e.get("/api/message/"+g[f].id+"?action=delete").success(function(h){if(h&&h.error){alert(h.error)}else{if(f==0){d.path("/mailbox/"+session.get("mailbox"))}else{g.splice(f,1);a.messages=g}}})};a.reply=function(){var f=a.replyBody;if(f.length<5){alert("短信内容最少为5个字符");return}e.post("/api/message?action=post","toUID="+a.replyTo.id+"&body="+encodeURIComponent(f)+"&topicMID="+a.topicMID,{headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}).success(function(g){if(!g){alert("服务器没有响应")}else{if(g.error){alert(g.error)}else{a.messages.push(g)}}});a.replyBody=null}}]);userApp.controller("BookmarkCtrl",["$scope","$routeParams","$cookies","$http","$location",function(a,c,b,g,f){if(!b.LZXSID||b.LZXSID!=cache.get("sessionID")||!cache.get("uid")){session.set("redirect",f.path());f.path("/login");return}a.navbar=getNavbar(userLinks,"#"+f.path());a.goToPage=function(h){g.get("/api/bookmark/"+cache.get("uid")+"?p="+h).success(function(i){a.nodes=i.nodes;if(i.pager&&i.pager.pageCount>1){a.pageCount=i.pager.pageCount;a.pageCurrent=i.pager.pageNo}})};a.goToPage(1);var e=["编辑","保存"];var d=[];a.editMode=false;a.action=e[0];a.toggleAction=function(){if(a.editMode){if(d.length){var h,k="";for(var j=0;j<d.length;j++){k+=d[j].id+","}g.get("/api/bookmark/"+k.substring(0,k.length-1)+"?action=delete").success(function(i){if(i&&i.error){alert(i.error)}else{a.editMode=false;a.action=e[0]}})}else{a.editMode=false;a.action=e[0]}}else{a.editMode=true;a.action=e[1]}d=[]};a.deleteBookmark=function(i){var h=a.nodes;d.push(h[i]);h.splice(i,1);a.nodes=h}}]);userApp.controller("ProfileCtrl",["$scope","$cookies","$http","$location",function(a,b,d,c){if(!b.LZXSID||b.LZXSID!=cache.get("sessionID")||!cache.get("uid")){session.set("redirect",c.path());c.path("/login");return}a.navbar=getNavbar(userLinks,"#"+c.path());d.get("/api/user/"+cache.get("uid")).success(function(e){a.user=e})}]);userApp.controller("LoginCtrl",["$scope","$http","$cookies","$location",function(a,d,b,c){if(b.LZXSID==cache.get("sessionID")&&cache.get("uid")>0){c.path("/profile");return}a.login=function(f,e){d.post("/api/authentication?action=post","username="+encodeURIComponent(f)+"&password="+encodeURIComponent(e),{headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}).success(function(g){if(!g){alert("服务器没有响应")}else{if(g.sessionID){cache.set("sessionID",g.sessionID);cache.set("uid",g.uid);if(g.uid>0){cache.set("username",g.username);cache.set("role",g.role)}}else{if(g.error){alert(g.error)}else{alert("对话加载失败")}}}var h=session.get("redirect");if(h){session.remove("redirect");c.path(h)}else{c.path("/profile")}})}}]);userApp.controller("LogoutCtrl",["$http","$cookies","$location",function(c,a,b){if(!a.LZXSID||a.LZXSID!=cache.get("sessionID")||!cache.get("uid")){b.path("/login");return}setTimeout(function(){c.get("/api/authentication/"+cache.get("sessionID")+"?action=delete").success(function(d){if(d&&d.error){alert(d.error)}else{cache.remove("sessionID");b.path("/login")}})},1)}]);