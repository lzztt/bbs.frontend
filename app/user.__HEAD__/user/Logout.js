"use strict";

var Logout = {
  controller: function() {
    console.log("# Logout.controller");

    var sessionID = session.getID();
    if (sessionID) {
      m.request({
        method: "DELETE",
        url: "/api/authentication/" + sessionID,
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
