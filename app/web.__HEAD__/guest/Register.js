'use strict';

var Register = {
  controller: function() {
    console.log('# Register.controller');
    this.email = m.prop('');
    this.username = m.prop('');
    this.captcha = m.prop('');
    this.agreement = m.prop('');
    this.step = 0;
    
    var ctrl = this, viewIsNew = true;
    this.submit = function(ev){
      console.log('submit ' + ctrl.step);
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      
      
    };
  },
  view: function(ctrl) {
    console.log('# Register.view');
    if (ctrl.step == 0) {
      var fields = [
        m.component(Form.Input, {type: 'email', label: '电子邮箱', name: 'email', value: ctrl.email}),
        m.component(Form.Input, {type: 'text', label: '用户名', name: 'username', value: ctrl.username}),
        m.component(Form.Captcha, {value: ctrl.captcha}),
        m('button', {type: 'submit'}, '创建新帐号')
      ];
    }
    else {
      var fields = [
        m.component(Form.Input, {type: 'text', label: '安全验证码', name: 'security', value: ctrl.security}),
        m.component(Form.Input, {type: 'password', label: '密码', name: 'password', value: ctrl.password}),
        m.component(Form.Input, {type: 'password', label: '确认密码', name: 'password2', value: ctrl.password2}),
        m('button', {type: 'submit'}, '保存密码')
      ];
    }

    return [GuestNavTab, m('form', {onsubmit: ctrl.submit, config: Form.autoFocus}, fields)];
  }
};

