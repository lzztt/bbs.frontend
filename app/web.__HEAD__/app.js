m.render(document.getElementById('navbar'), Navbar);

//define a route
m.route(document.getElementById('page'), "/", {
  "/": Home,
  '/login': Login,
  '/register': Register,
  '/password': Password,
  '/logout': Logout,
  "/user/:uid": User,
  '/user': User,
  "/tag/:tid": Tag,
  "/node/:nid": Node,
});