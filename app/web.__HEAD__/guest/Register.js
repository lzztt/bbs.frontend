'use strict';

var Register = {
  controller: function() {
    this.email = m.prop('');
    this.username = m.prop('');
    this.captcha = m.prop('');
    this.agreement = m.prop('');
  },
  view: function(ctrl) {
    return [GuestNavTab, m('form', {onsubmit: function(ev) {
          ev.preventDefault();
        }, config: Form.autoFocus}, [
        m.component(Form.Input, {type: 'email', label: '电子邮箱', name: 'email', value: ctrl.email}),
        m.component(Form.Input, {type: 'text', label: '用户名', name: 'username', value: ctrl.username}),
        m.component(Form.Captcha, {value: ctrl.captcha}),
        m('button', {type: 'submit'}, '创建新帐号')
      ])];
  }
};

