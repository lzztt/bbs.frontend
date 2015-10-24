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

    var ctrl = this, viewIsNew = true;
    this.submit = function(ev) {
      console.log('submit ' + ctrl.step);
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();

      var form = ev.target;

      if (viewIsNew) {
        viewIsNew = false;
        // pause redraw
        m.startComputation();
      }

      if (ctrl.step == 0) {
        // validate email and username
        var fields = ['email', 'username', 'captcha'];
        for (var i in fields) {
          console.log(i + ' ' + fields[i] + ': ' + ctrl[fields[i]]());
          if (!ctrl[fields[i]]()) {
            console.log(fields[i] + ' empty');
            $('input[name="' + fields[i] + '"]', form).focus();
            return false;
          }
        }

        m.request({
          method: "POST",
          url: "/api/identificationcode",
          data: {email: ctrl.email(), username: ctrl.username(), captcha: ctrl.captcha()},
          serialize: function(data) {
            return m.route.buildQueryString(data)
          },
          config: function(xhr) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
          }})
          .then(function(data) {
            console.log('ident request finished');
            if (validateResponse(data)) {
              alert("安全验证码已经成功发送到您的注册邮箱 " + ctrl.email() + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
              // clear captcha image
              $('div.captcha', form).remove();

              // go to next step
              viewIsNew = true;
              ctrl.step++;
              // continue to redraw the view
              m.endComputation();
            }
          });
      }
      else
      {
        var fields = ['security', 'password'];
        for (var i in fields) {
          if (!ctrl[fields[i]]()) {
            $('input[name="' + fields[i] + '"]', form).focus();
            return false;
          }
        }

        if (ctrl.password() != ctrl.password2()) {
          $('input[name="password2"]', form).focus();
          return false;
        }

        m.request({
          method: "POST",
          url: "/api/user/" + ctrl.security() + '?action=put',
          data: {password: ctrl.password()},
          serialize: function(data) {
            return m.route.buildQueryString(data)
          },
          config: function(xhr) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
          }})
          .then(function(data) {
            console.log('password request finished');
            if (validateResponse(data)) {
              alert("您的新密码已经设置成功");
              // redirect to login
              viewIsNew = true;
              m.route('/login');
              // continue to redraw the view
              m.endComputation();
            }
          });
      }

      console.log('submit end');
    };
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

