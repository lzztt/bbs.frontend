"use strict";

var userLinks = [{
  uri: "/app/web/",
  name: "首页"
}, {
  uri: "/app/web/user",
  name: "我的账户"
}, {
  uri: "/app/web/pm/inbox",
  name: "短信"
}, {
  uri: "/app/web/logout",
  name: "登出"
}, ];

var User = {
  controller: function() {
    console.log("# User.controller()");
    if (!validateLoginSession())
      return;

    var uid = m.route.param("uid");
    if (!uid) {
      uid = cache.get("uid");
      this.isSelf = true;
    } else {
      this.isSelf = (uid == cache.get("uid"));
    }

    this.user = m.request({
      method: "GET",
      url: "/api/user/" + uid
    });

    this.editMode = false;
    this.toggleEditMode = function(ev) {
      console.log("ctrl.editMode ", this.editMode);
      this.editMode = !this.editMode;
      // clear values
      this.edit = {};
    }.bind(this);

    this.save = function(ev) {
      if (!$.isEmptyObject(this.edit)) {
        var user = this.user();
        for (var key in this.edit) {
          user[key] = this.edit[key];
        }
        this.user(user);

        // send changes to server
        m.request({
            method: "POST",
            url: "/api/user/" + user.id + "?action=put",
            data: this.edit,
            background: true,
            serialize: function(data) {
              return m.route.buildQueryString(data)
            },
            config: function(xhr) {
              xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
              xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
            }
          })
          .then(function(data) {
            validateResponse(data);
          });
      }
      this.editMode = !this.editMode;
    }.bind(this);

    this.imageCropper = function(el, isInit) {
      if (!isInit) {
        var user = this.user();
        var avatar = user.avatar ? user.avatar : "/data/avatars/avatar0" + Math.ceil(Math.random() * 5) + ".jpg";
        if (this.isSelf) {
          // jquery avatar uploader
          $(el).imageCropper({
            windowWidth: 120,
            windowHeight: 120,
            uploadURL: "/api/user/" + uid + "?action=put",
            uploadName: "avatar",
            defaultImage: avatar
          });
        } else {
          $(el).append("<img src="" + avatar + "">");
        }
      }
    }.bind(this);

    this.checkSex = function(el) {
      var sex = this.user().sex;
      $("input", el).each(function() {
        if (sex == this.value)
          this.checked = true;
      });
    }.bind(this);

    this.UTCDateString = function(dt) {
      var d = "" + dt.getUTCDate(),
        m = "" + (dt.getUTCMonth() + 1),
        y = dt.getUTCFullYear();
      if (d.length < 2)
        d = "0" + d;
      if (m.length < 2)
        m = "0" + m;
      return m + "/" + d + "/" + y;
    };

    this.ISODateString = function(dt) {
      return dt.toISOString().split("T")[0];
    };

    this.editor = false;
    this.toggleMsgEditor = function() {
      this.editor = !this.editor;
    }.bind(this);
    this.sentMsg = function() {
      this.editor = false;
      alert("您的新短信已经成功发送给 " + this.user().username + " ，同时也保存在了您的短信发件箱中");
    }.bind(this);
  },
  view: function(ctrl) {
    console.log("# User.view()");
    var user = ctrl.user();
    if (ctrl.editor) {
      return m.component(MsgEditor, {
        replyTo: {
          id: user.id,
          username: user.username
        },
        success: ctrl.sentMsg,
        cancel: ctrl.toggleMsgEditor
      });
    }

    var bdate = user.birthday ? new Date(user.birthday * 1000) : new Date();

    return [
      ctrl.isSelf ? m.component(NavTab, {
        links: userLinks,
        active: "/user"
      }) : null,
      m("figure", [
        m("div", {
          class: "imgCropper",
          config: ctrl.imageCropper
        }),
        m("figcaption", [
          user.username,
          ctrl.isSelf ? m("span", {
            style: "font-size: 0.9rem; color: blue"
          }, "(点击图片上传头像)") : null
        ])
      ]),
      ctrl.isSelf ? [
        ctrl.editMode ? m("button", {
          type: "button",
          onclick: ctrl.save
        }, "保存") : null,
        m("button", {
          type: "button",
          onclick: ctrl.toggleEditMode
        }, ctrl.editMode ? "取消" : "编辑个人资料")
      ] : m("button", {
        type: "button",
        onclick: ctrl.toggleMsgEditor
      }, "发送站内短信"),
      m("dl", [
        m("dt", "微信"), !ctrl.editMode ? m("dd", user.wechat) : m("input", {
          type: "text",
          value: user.wechat,
          onchange: function(ev) {
            ctrl.edit.wechat = ev.target.value;
            m.redraw.strategy("none");
          }
        }),
        m("dt", "个人网站"), !ctrl.editMode ? m("dd", user.website) : m("input", {
          type: "url",
          value: user.website,
          onchange: function(ev) {
            ctrl.edit.website = ev.target.value;
            m.redraw.strategy("none");
          }
        }),
        m("dt", "性别"), !ctrl.editMode ? m("dd", user.sex === 1 ? "男" : (user.sex === 0 ? "女" : "未知")) :
        m("span.buttongroup", {
          config: ctrl.checkSex
        }, [
          m("span.radio", [m("input#sex1", {
            type: "radio",
            name: "sex",
            value: 1,
            onchange: function(ev) {
              ctrl.edit.sex = 1;
              m.redraw.strategy("none");
            }
          }), m("label", {
            for: "sex1"
          }, "男")]),
          m("span.radio", [m("input#sex0", {
            type: "radio",
            name: "sex",
            value: 0,
            onchange: function(ev) {
              ctrl.edit.sex = 0;
              m.redraw.strategy("none");
            }
          }), m("label", {
            for: "sex0"
          }, "女")])
        ]),
        m("dt", "生日"), !ctrl.editMode ? m("dd", user.birthday ? ctrl.UTCDateString(bdate) : "") : m("input", {
          type: "date",
          value: ctrl.ISODateString(bdate),
          onchange: function(ev) {
            ctrl.edit.birthday = new Date(ev.target.value).getTime() / 1000;
            m.redraw.strategy("none");
          }
        }),
        m("dt", "职业"), !ctrl.editMode ? m("dd", user.occupation) : m("input", {
          type: "text",
          value: user.occupation,
          onchange: function(ev) {
            ctrl.edit.occupation = ev.target.value;
            m.redraw.strategy("none");
          }
        }),
        m("dt", "兴趣爱好"), !ctrl.editMode ? m("dd", user.interests) : m("input", {
          type: "text",
          value: user.interests,
          onchange: function(ev) {
            ctrl.edit.interests = ev.target.value;
            m.redraw.strategy("none");
          }
        }),
        m("dt", "自我介绍"), !ctrl.editMode ? m("dd", user.favoriteQuotation) : m("input", {
          type: "text",
          value: user.favoriteQuotation,
          onchange: function(ev) {
            ctrl.edit.favoriteQuotation = ev.target.value;
            m.redraw.strategy("none");
          }
        }),
        m("dt", "注册时间"), m("dd", (new Date(user.createTime * 1000)).toLocaleDateString()),
        m("dt", "上次登陆时间"), m("dd", (new Date(user.lastAccessTime * 1000)).toLocaleDateString()),
        m("dt", "上次登陆地点"), m("dd", user.lastAccessCity)
      ]),
      m("table.user_topics", [
        m("caption", "最近发表的论坛话题"),
        m("thead", m("tr", [
          m("th", "论坛话题"),
          m("th", "发表时间")
        ])),
        m("tbody", user.topics.map(function(node) {
          return m("tr", [
            m("td", m("a", {
              href: "/app/web/node/" + node.nid,
              config: m.route
            }, node.title)),
            m("td", ctrl.UTCDateString(new Date(node.createTime * 1000)))
          ]);
        }))
      ]),
      m("table.user_topics", [
        m("caption", "最近回复的论坛话题"),
        m("thead", m("tr", [
          m("th", "论坛话题"),
          m("th", "发表时间")
        ])),
        m("tbody", user.comments.map(function(node) {
          return m("tr", [
            m("td", m("a", {
              href: "/app/web/node/" + node.nid,
              config: m.route
            }, node.title)),
            m("td", ctrl.UTCDateString(new Date(node.createTime * 1000)))
          ]);
        }))
      ])
    ]
  }
};
