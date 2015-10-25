'use strict';

var Message = {
  controller: function() {
    console.log('# Message.controller()');
    if (!validateLoginSession())
      return;

    this.id = m.route.param("mid");
    this.msgs = m.request({method: "GET", url: '/api/message/' + this.id});

    this.loadPage = function(i) {
      this.msgs = m.request({method: "GET", url: '/api/message/' + this.id + '?p=' + i});
    }.bind(this);

    this.delete = function(mid) {
      return function(ev) {
        console.log('delete ' + mid);
      };
    }
  },
  view: function(ctrl) {
    console.log(ctrl.msgs());
    var msgs = ctrl.msgs().msgs,
      replyTo = ctrl.msgs().replyTo;

    return m('article', msgs.map(function(msg, index) {
      return m('section', {key: msg.id}, [
        m('header', [
          m('a', {href: '/user/' + msg.uid, config: m.route}, msg.username),
          ' ' + toLocalDateTimeString(new Date(msg.time * 1000))
        ]),
        m('p', [
          msg.body + ' ',
          m('button', {onclick: ctrl.delete(msg.id)}, index ? '删除' : '删除对话')
        ])
      ]);
    }));
  }
};

