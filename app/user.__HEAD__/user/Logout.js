"use strict";

var Logout = {
  controller: function() {
    console.log("# Logout.controller");

    var sessionID = session.getID();
    if (sessionID) {
      m.request({
        method: "GET",
        url: "/api/authentication/" + sessionID + "?action=delete",
        background: true
      });
    }

    cache.remove("uid");
    m.route("/app/user/login");
  },
  view: function(ctrl) {
    console.log("# Logout.view");
  }
};
