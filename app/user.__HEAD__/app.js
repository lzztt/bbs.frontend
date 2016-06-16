"use strict";

var PageNotFound = {
  view: function(ctrl) {
    return "Page Not Found :(";
  }
};

var AppHome = {
  controller: function() {
    console.log("# Home.controller()");
    if (!validateLoginSession()) {
      m.route("/app/user/login");
    } else {
      m.route("/app/user/" + cache.get("uid"));
    }
  },
  view: function(ctrl) {
    console.log("# Home.view()");
  }
};

var appBase = "/app/user";

//define a route
m.route(document.getElementById("page"), "/app/user/page-not-found", {
  "/app/user/page-not-found": PageNotFound,
  "/app/user": AppHome,
  "/app/user/login": Login,
  "/app/user/register": Register,
  "/app/user/password": Password,
  "/app/user/logout": Logout,
  "/app/user/bookmark": Bookmark,
  "/app/user/:uid": User,
  "/app/user/mailbox/inbox": Mailbox,
  "/app/user/mailbox/sent": Mailbox,
  "/app/user/pm/:mid": Message
});
