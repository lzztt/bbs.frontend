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

    this.delete = function(index) {
      return function(ev) {
        console.log('delete ' + index);
        var answer = confirm(index === 0 ? '整个对话的所有消息将被删除？' : '此条消息将被删除？');
        if (answer) {
          var msgs = this.msgs().msgs;
          m.request({method: 'GET', url: '/api/message/' + msgs[index].id + '?action=delete'}).then(function(data) {
            if (validateResponse(data)) {
              if (index === 0) {
                m.route('/pm/' + session.get('mailbox'));
              }
              else {
                msgs.splice(index, 1);
              }
            }
          });
        }
      }.bind(this);
    }.bind(this);

    this.replyMsg = m.prop('');
    this.sendReply = function(ev) {
      var msg = this.replyMsg();
      if (msg.length < 5) {
        m.redraw.strategy('none');
        alert('短信内容最少为5个字符');
        return;
      }
      m.request({
        method: 'POST',
        url: '/api/message',
        data: {toUID: this.msgs().replyTo.id, body: msg, topicMID: this.id},
        serialize: function(data) {
          return m.route.buildQueryString(data)
        },
        config: function(xhr) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        }})
        .then(function(data) {
          if (validateResponse(data)) {
            this.msgs().msgs.push(data);
            this.replyMsg('');
          }
        }.bind(this));
    }.bind(this);
  },
  view: function(ctrl) {
    console.log('# Message.view()');
    var body,
      msgs = ctrl.msgs().msgs,
      replyTo = ctrl.msgs().replyTo;

    if (msgs) {
      body = m('article', [
        msgs.map(function(msg, index) {
          return           m('section', {key: msg.id}, [
            m('header', [
              m('a', {href: '/user/' + msg.uid, config: m.route}, msg.username),
              ' ' + toLocalDateTimeString(new Date(msg.time * 1000))
            ]),
            m('p', [
              msg.body + ' ',
              m('button', {onclick: ctrl.delete(index)}, index ? '删除' : '删除对话')
            ])
          ]);
        }),
        // THIS NEED TO BE A COMPONENT OR A ROUTE PAGE
        // and NEED TO BE IN A POPUP WINDOW ON USER AND NODE page
        m('form', {onsubmit: ctrl.sendReply}, [
          m.component(Form.Text, {label: '收信人', value: replyTo.username}),
          m.component(Form.TextArea, {label: '', value: ctrl.replyMsg}),
          m.component(Form.Button, {type: 'submit', value: '发送'})
        ])
      ]);
    }
    else {
      body = '错误: 短信不存在';
    }

    return [
      m.component(NavTab, {links: userLinks, active: '/pm/inbox'}),
      m.component(NavTab, {links: mailboxLinks, active: '/pm/' + session.get('mailbox')}),
      body
    ];
  }
};

