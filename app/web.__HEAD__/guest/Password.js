'use strict';

var Password = {
  controller: function() {
    this.email = m.prop('');
    this.username = m.prop('');

    this.captcha = m.prop('');

    this.security = m.prop('');
    this.password = m.prop('');
    this.password2 = m.prop('');

    this.step = 0;

    this.return = m.prop();
    this.error = m.prop();

    this.submit = function(ev) {
      console.log(this.step);
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();

      if (this.step == 0) {
        // validate email and username
        var fields = ['email', 'username', 'captcha'];
        for (var i in fields) {
          console.log(i + ' ' + fields[i] + ': ' + this[fields[i]]());
          if (!this[fields[i]]()) {
            console.log(fields[i] + ' empty');
            $('input[name="' + fields[i] + '"]', ev.target).focus();
            m.redraw.strategy("none");
            return false;
          }
        }

        m.request({method: "POST", url: "/api/identificationcode", data: {email: this.email(), username: this.username(), captcha: this.captcha()}});
        $('div.captcha', ev.target).remove();
      }
      else
      {
        var fields = ['security', 'password'];
        for (var i in fields) {
          if (!this[fields[i]]()) {
            $('input[name="' + fields[i] + '"]', ev.target).focus();
            m.redraw.strategy("none");
            return false;
          }
        }

        if (this.password() != this.password2()) {
          $('input[name="password2"]', ev.target).focus();
          m.redraw.strategy("none");
          return false;
        }

        m.request({method: "POST", url: "/api/user/" + this.security(), data: {password: this.password()}});
      }

      // move to next step
      this.step++;
    }.bind(this);
  },
  view: function(ctrl) {
    console.log('### Password view');
    if (ctrl.step == 0) {
      var fields = [
        m.component(Form.Input, {type: 'email', label: '注册邮箱', name: 'email', value: ctrl.email}),
        m.component(Form.Input, {type: 'text', label: '用户名', name: 'username', value: ctrl.username}),
        m.component(Form.Captcha, {value: ctrl.captcha}),
        m('button', {type: 'submit'}, '请求重设密码')
      ];
    }
    else {
      var fields = [
        m.component(Form.Input, {type: 'text', label: '安全验证码', name: 'security', value: ctrl.security}),
        m.component(Form.Input, {type: 'password', label: '新密码', name: 'password', value: ctrl.password}),
        m.component(Form.Input, {type: 'password', label: '确认新密码', name: 'password2', value: ctrl.password2}),
        m('button', {type: 'submit'}, '保存密码')
      ];
    }

    return [GuestNavTab, m('form', {onsubmit: ctrl.submit, config: Form.autoFocus}, fields)];
  }
};

