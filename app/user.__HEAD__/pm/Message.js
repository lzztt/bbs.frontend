"use strict";

var Message = {
  controller: function() {
    console.log("# Message.controller()");
    if (!validateLoginSession()) {
      session.set("redirect", m.route());
      m.route("/app/user/login");
      return;
    }

    var self = this;
    this.id = m.route.param("mid");
    this.msgs = m.request({
      method: "GET",
      url: "/api/message/" + this.id
    });

    this.deleteMessage = function(index) {
      return function(ev) {
        console.log("deleteMessage " + index);
        var answer = confirm(index === 0 ? "整个对话的所有消息将被删除？" : "此条消息将被删除？");
        if (answer) {
          var msgs = self.msgs().msgs;
          m.request({
            method: "GET",
            url: "/api/message/" + msgs[index].id + "?action=delete"
          }).then(function(data) {
            if (validateResponse(data)) {
              if (index === 0) {
                m.route("/app/user/mailbox/" + session.get("mailbox"));
              } else {
                msgs.splice(index, 1);
              }
            }
          });
        }
      };
    };

    this.editor = false;
    this.onMsgSent = function(data) {
      self.msgs().msgs.push(data);
      self.editor = false;
    };
    this.toggleMsgEditor = function() {
      self.editor = !self.editor;
    };
  },
  view: function(ctrl) {
    console.log("# Message.view()");
    if (!ctrl.editor) {
      var body,
        msgs = ctrl.msgs().msgs,
        replyTo = ctrl.msgs().replyTo;

      if (msgs) {
        body = m("article.topic", [msgs.map(function(msg, index) {
            return m("section", {
              key: msg.id
            }, [
              m("header", [
                m("a", {
                  href: "/app/user/" + msg.uid,
                  config: m.route
                }, msg.username),
                " " + toLocalDateTimeString(new Date(msg.time * 1000))
              ]),
              m("p", [
                msg.body + " ",
                m("i", {
                  "class": "icon-trash",
                  onclick: ctrl.deleteMessage(index)
                }, ""),
              ])
            ]);
          }),
          m("div", m("i", {
            "class": "icon-edit button",
            onclick: ctrl.toggleMsgEditor
          }, "回复"))
        ]);
      } else {
        body = "错误: 短信不存在";
      }
    } else {
      body = m.component(MsgEditor, {
        replyTo: ctrl.msgs().replyTo,
        topicMID: ctrl.id,
        success: ctrl.onMsgSent,
        cancel: ctrl.toggleMsgEditor
      });
    }

    return [
      m.component(NavTab, {
        links: userLinks,
        active: "/app/user/mailbox/inbox"
      }),
      m.component(NavTab, {
        links: mailboxLinks,
        active: "/app/user/mailbox/" + session.get("mailbox")
      }),
      body
    ];
  }
};
