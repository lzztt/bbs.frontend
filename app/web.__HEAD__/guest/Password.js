'use strict';

var Password = {
  controller: function() {
    console.log('# Password.controller');
    this.email = m.prop('');
    this.username = m.prop('');

    this.captcha = m.prop('');

    this.security = m.prop('');
    this.password = m.prop('');
    this.password2 = m.prop('');

    this.step = 0;

    this.return = m.prop();
    this.error = m.prop();

    var onIdentRequestSuccess = function(data) {
      console.log('ident request finished');
      if (validateResponse(data)) {
        alert("安全验证码已经成功发送到您的注册邮箱 " + this.email + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
      }
      else {
        this.step = 0;
      }
    }.bind(this);

    var onPasswordRequestSuccess = function(data) {
      console.log('password request finished');
      if (validateResponse(data)) {
        alert("您的新密码已经设置成功");
      }
      else {
        this.step = 1;
      }
    }.bind(this);

    this.submit = function(ev) {
      console.log('submit ' + this.step);
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

        m.request({
          method: "POST",
          url: "/api/identificationcode",
          data: {email: this.email(), username: this.username(), captcha: this.captcha()},
          serialize: function(data) {
            return m.route.buildQueryString(data)
          },
          config: function(xhr) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
          }}).then(onIdentRequestSuccess);

        // clear captcha, just in case need to re-input
        this.captcha('');
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

        m.request({
          method: "POST",
          url: "/api/user/" + this.security() + '?action=put',
          data: {password: this.password()},
          serialize: function(data) {
            return m.route.buildQueryString(data)
          },
          config: function(xhr) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
          }}).then(onPasswordRequestSuccess);
      }

      // move to next step
      this.step++;
      console.log('submit end');
    }.bind(this);
  },
  view: function(ctrl) {
    console.log('# Password.view');
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

