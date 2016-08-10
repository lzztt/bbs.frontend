"use strict";

m.render(document.getElementById('navbar'), Navbar);

//define a route
m.route(document.getElementById("page"), "/app/tag/page-not-found", {
    "/app/tag/page-not-found": PageNotFound,
    "/app/tag/:tid": Tag,
    "/:arg...": Redirect
});
