'use strict';

m.render(document.getElementById('navbar'), Navbar);

var PageNotFound = {
  view: function(ctrl) {
    return 'Page Not Found :(';
  }
};

//define a route
m.route(document.getElementById('page'), '/app/web/404', {
  '/app/web/404': PageNotFound,
  '/app/web/': Home,
  '/app/web/login': Login,
  '/app/web/register': Register,
  '/app/web/password': Password,
  '/app/web/logout': Logout,
  '/app/web/user/:uid': User,
  '/app/web/user': User,
  '/app/web/pm/inbox': Mailbox,
  '/app/web/pm/sent': Mailbox,
  '/app/web/pm/:mid': Message,
  '/app/web/tag/:tid': Tag,
  '/app/web/node/:nid': Node,
});
