"use strict";

var Password = {
  controller: function() {
    console.log("# Password.controller");
    if (validateLoginSession()) {
      m.route("/app/user/" + cache.get("uid"));
      return;
    }

    var self = this;
    this.step = 0;
    this.next = function() {
      self.step++;
    };
    this.finish = function() {
      m.route("/app/user/login");
    };
  },
  view: function(ctrl) {
    console.log("# Password.view");
    if (ctrl.step == 0) {
      return Password.Init(ctrl.next);
    } else {
      return Password.Setter(ctrl.finish);
    }
  }
};

Password.Init = function(success) {
  console.log("# Password.Init");

  var self = this;

  this.email = m.prop("");
  this.username = m.prop("");
  this.captcha = m.prop("");

  var isRedrawPaused = false;
  var submit = function(ev) {
    console.log("init submit");
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
    var fields = ["email", "username", "captcha"];
    for (var i in fields) {
      console.log(i + " " + fields[i] + ": " + self[fields[i]]());
      if (!self[fields[i]]()) {
        console.log(fields[i] + " empty");
        $("input[name='" + fields[i] + "']", form).focus();
        return false;
      }
    }

    m.request({
        method: "POST",
        url: "/api/identificationcode",
        data: {
          email: self.email(),
          username: self.username(),
          captcha: self.captcha()
        },
        serialize: function(data) {
          return m.route.buildQueryString(data)
        },
        config: function(xhr) {
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
        }
      })
      .then(function(data) {
        console.log("ident request finished");
        if (validateResponse(data)) {
          alert("安全验证码已经成功发送到您的注册邮箱 " + self.email() + " ，请检查email。\n如果您的收件箱内没有此电子邮件，请检查电子邮件的垃圾箱，或者与网站管理员联系。");
          // clear captcha image
          $("div.captcha", form).remove();

          // call the success callback
          success();
          // continue to redraw the view
          m.endComputation();
        }
      });
  };

  return [
    m.component(NavTab, {
      links: guestLinks,
      active: m.route()
    }),
    m("form", {
      onsubmit: submit,
      config: Form.autoFocus
    }, [
      m.component(Form.Input, {
        type: "email",
        label: "注册邮箱",
        name: "email",
        value: this.email
      }),
      m.component(Form.Input, {
        type: "text",
        label: "用户名",
        name: "username",
        value: this.username
      }),
      m.component(Form.Captcha, {
        value: this.captcha
      }),
      m.component(Form.Button, {
        type: "submit",
        value: "请求重设密码"
      })
    ])
  ];
};

Password.Setter = function(success) {
  console.log("# Password.Setter");

  var self = this;

  this.security = m.prop("");
  this.password = m.prop("");

  var password2 = m.prop("");
  var isRedrawPaused = false;

  var submit = function(ev) {
    console.log("password setter submit");

    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    var form = ev.target;

    if (!isRedrawPaused) {
      isRedrawPaused = true;
      // pause redraw
      m.startComputation();
    }

    var fields = ["security", "password"];
    for (var i in fields) {
      if (!self[fields[i]]()) {
        $("input[name='" + fields[i] + "']", form).focus();
        return false;
      }
    }

    if (self.password() != password2()) {
      $("input[name='password2']", form).focus();
      return false;
    }

    m.request({
        method: "PUT",
        url: "/api/user/" + self.security(),
        data: {
          password: self.password()
        },
        serialize: function(data) {
          return m.route.buildQueryString(data)
        },
        config: function(xhr) {
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
        }
      })
      .then(function(data) {
        console.log("password request finished");
        if (validateResponse(data)) {
          alert("您的新密码已经设置成功");
          // call the success callback
          success()
            // continue to redraw the view
          m.endComputation();
        }
      });
  };

  return [
    m.component(NavTab, {
      links: guestLinks,
      active: m.route()
    }),
    m("form", {
      onsubmit: submit,
      config: Form.autoFocus
    }, [
      m.component(Form.Text, {
        value: [m("h3", "设置您的账户密码"), "安全验证码已发送到您的注册邮箱"]
      }),
      m.component(Form.Input, {
        type: "text",
        label: "安全验证码",
        name: "security",
        value: this.security
      }),
      m.component(Form.Input, {
        type: "password",
        label: "新密码",
        name: "password",
        value: this.password
      }),
      m.component(Form.Input, {
        type: "password",
        label: "确认新密码",
        name: "password2",
        value: password2
      }),
      m.component(Form.Button, {
        type: "submit",
        value: "保存密码"
      })
    ])
  ];
};
