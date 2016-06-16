'use strict';

var mailboxLinks = [
  {uri: "/app/web/pm/inbox", name: '收件箱'},
  {uri: "/app/web/pm/sent", name: '发件箱'}
];

var Mailbox = {
  controller: function() {
    console.log('# Mailbox.controller()');
    if (!validateLoginSession())
      return;

    var mailbox = m.route().split('/').pop();
    session.set('mailbox', mailbox);

    this.messages = m.request({method: "GET", url: '/api/message/' + mailbox});

    this.loadPage = function(i) {
      this.messages = m.request({method: "GET", url: '/api/message/' + mailbox + '?p=' + i});
    }.bind(this);
  },
  view: function(ctrl) {
    var msgs = ctrl.messages().msgs,
      p = ctrl.messages().pager;
    if (msgs.length) {
      console.log('# Mailbox.view() ', p.pageNo, p.pageCount);

      var table = m('table',
        m('thead',
          m('tr', [
            m('th', '短信'),
            m('th', '联系人'),
            m('th', '时间')
          ])),
        m('tbody', msgs.map(function(msg) {
          return m('tr', [
            m('td', m('a', {href: '/app/web/pm/' + msg.mid, config: m.route}, msg.body)),
            m('td', m('a', {href: '/app/web/user/' + msg.uid, config: m.route}, msg.user)),
            m('td', toLocalDateTimeString(new Date(msg.time * 1000)))
          ]);
        })));
      if (p.pageCount > 1) {
        var pager = m.component(Pager, {current: p.pageNo, count: p.pageCount, handler: ctrl.loadPage});
        pager = pager.view(pager.controller()); // just render the component
        table = [pager, table, pager];
      }
    }
    else
    {
      table = 'mailbox is empty, start sending a message.';
    }

    return [
      m.component(NavTab, {links: userLinks, active: '/app/user/pm/inbox'}),
      m.component(NavTab, {links: mailboxLinks, active: m.route()}),
      table
    ];
  }
};


