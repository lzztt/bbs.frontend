'use strict';

var Register = {
  controller: function() {
    console.log('# Register.controller');
    this.step = 0;
    this.next = function() {
      this.step++;
    }.bind(this);
    this.finish = function() {
      m.route('/login');
    };
  },
  view: function(ctrl) {
    console.log('# Register.view');
    if (ctrl.step == 0) {
      return Register.Init(ctrl.next);
    }
    else {
      return Password.Setter(ctrl.finish);
    }
  }
};

Register.Init = function(success) {
  console.log('# Register.Init');
  this.email = m.prop('');
  this.username = m.prop('');
  this.captcha = m.prop('');

  var isRedrawPaused = false;
  var submit = function(ev) {
    console.log('init submit');
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    var form = ev.target;

    if (!isRedrawPaused) {
      isRedrawPaused = true;
      // pause redraw
      m.startComputation();
    }

    // validate email and username
    var fields = ['email', 'username', 'captcha'];
    for (var i in fields) {
      console.log(i + ' ' + fields[i] + ': ' + this[fields[i]]());
      if (!this[fields[i]]()) {
        console.log(fields[i] + ' empty');
        $('input[name="' + fields[i] + '"]', form).focus();
        return false;
      }
    }

    m.request({
      method: "POST",
      url: "/api/user",
      data: {email: this.email(), username: this.username(), captcha: this.captcha()},
      serialize: function(data) {
        return m.route.buildQueryString(data)
      },
      config: function(xhr) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      }})
      .then(function(data) {
        console.log('user request finished');
        if (validateResponse(data)) {
          alert("感谢注册！帐号激活\n安全验证码已经成功发送到您的注册邮箱 " + this.email() + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
          // clear captcha image
          $('div.captcha', form).remove();

          // call the success callback
          success();
          // continue to redraw the view
          m.endComputation();
        }
      }.bind(this));
  }.bind(this);

  return [
    m.component(NavTab, {links: guestLinks, active: m.route()}),
    m('form', {onsubmit: submit, config: Form.autoFocus}, [
      m.component(Form.Input, {type: 'email', label: '电子邮箱', name: 'email', value: this.email}),
      m.component(Form.Input, {type: 'text', label: '用户名', name: 'username', value: this.username}),
      m.component(Form.Captcha, {value: this.captcha}),
      m('fieldset', ['[',
        m('a', {href: '/node/23200'}, '网站使用规范'),
        '] [',
        m('a', {href: '/term'}, '免责声明'),
        ']']),
      m('fieldset', m('button', {type: 'submit'}, '同意使用规范和免责声明，并创建帐号'))
    ])];
};
