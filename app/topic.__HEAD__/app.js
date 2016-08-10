"use strict";

m.render(document.getElementById('navbar'), Navbar);

//define a route
m.route(document.getElementById("page"), "/app/topic/page-not-found", {
    "/app/topic/page-not-found": PageNotFound,
    "/app/topic/:nid": Topic,
    "/:arg...": Redirect
});
