'use strict';
var Login = {
  controller: function() {
    console.log('# Login.controller()');

    this.email = m.prop('');
    this.password = m.prop('');

    var isRedrawPaused = false;
    this.submit = function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();

      if (!isRedrawPaused) {
        isRedrawPaused = true;
        // pause redraw
        m.startComputation();
      }

      m.request({
        method: "POST",
        url: "/api/authentication",
        data: {email: this.email(), password: this.password()},
        serialize: function(data) {
          return m.route.buildQueryString(data)
        },
        config: function(xhr) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        }})
        .then(function(data) {
          console.log(data);
          if (validateResponse(data)) {
            if (data.sessionID && data.uid) {
              cache.set('sessionID', data.sessionID);
              cache.set('uid', data.uid);
              cache.set('username', data.username);
              cache.set('role', data.role);

              var redirect = session.get('redirect');
              if (redirect) {
                session.remove('redirect');
                m.route(redirect);
              }
              else {
                m.route('/');
              }
              // continue to redraw the view
              m.endComputation();
            }
            else {
              // still a guest?
              alert('用户登录失败');
            }
          }
        });
    }.bind(this);
  },
  view: function(ctrl) {
    console.log('# Login.view');
    return [
      m.component(NavTab, {links: guestLinks, active: m.route()}),
      m('form', {onsubmit: ctrl.submit, config: Form.autoFocus}, [
        m.component(Form.Input, {type: 'email', label: '注册邮箱', name: 'email', value: ctrl.email}),
        m.component(Form.Input, {type: 'password', label: '密码', name: 'password', value: ctrl.password}),
        m('button', {type: 'submit'}, '登录')
      ])];
  }
};

