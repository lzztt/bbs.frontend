'use strict';

m.render(document.getElementById('navbar'), Navbar);

var PageNotFound = {
  view: function(ctrl) {
    return 'Page Not Found :(';
  }
};

//define a route
m.route(document.getElementById('page'), "/404", {
  '/404': PageNotFound,
  "/": Home,
  '/login': Login,
  '/register': Register,
  '/password': Password,
  '/logout': Logout,
  "/user/:uid": User,
  '/user': User,
  '/pm/inbox': Mailbox,
  '/pm/sent': Mailbox,
  '/pm/:mid': Message,
  "/tag/:tid": Tag,
  "/node/:nid": Node,
});