'use strict';
var Login = {
  controller: function() {
    console.log('# Login.controller()');
    if (cache.get('uid') > 0) {
      m.route('/');
    }

    this.email = m.prop('');
    this.password = m.prop('');
    this.submit = function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();

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
            if (data.sessionID) {
              cache.set('sessionID', data.sessionID);
              cache.set('uid', data.uid);
              if (data.uid > 0) {
                cache.set('username', data.username);
                cache.set('role', data.role);
              }
              else {
                // still a guest?
                alert('用户登录失败');
              }
            }
            else {
              alert('对话加载失败');
            }
          }

          var redirect = session.get('redirect');
          if (redirect) {
            session.remove('redirect');
            if (redirect.substring(0, 4) === 'http') {
              window.location.href = redirect;
            }
            else {
              m.route(redirect);
            }
          }
          else {
            m.route('/');
            ;
          }
        });
    }.bind(this);
  },
  view: function(ctrl) {
    return [GuestNavTab, m('form', {onsubmit: ctrl.submit, config: Form.autoFocus}, [
        m.component(Form.Input, {type: 'email', label: '注册邮箱', name: 'email', value: ctrl.email}),
        m.component(Form.Input, {type: 'password', label: '密码', name: 'password', value: ctrl.password}),
        m('button', {type: 'submit'}, '登录')
      ])];
  }
};

