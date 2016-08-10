"use strict";

var Message = {
  controller: function() {
    console.log("# Message.controller()");
    if (!validateLoginSession())
      return;

    this.id = m.route.param("mid");
    this.msgs = m.request({
      method: "GET",
      url: "/api/message/" + this.id
    });

    this.loadPage = function(i) {
      this.msgs = m.request({
        method: "GET",
        url: "/api/message/" + this.id + "?p=" + i
      });
    }.bind(this);

    this.delete = function(index) {
      return function(ev) {
        console.log("delete " + index);
        var answer = confirm(index === 0 ? "整个对话的所有消息将被删除？" : "此条消息将被删除？");
        if (answer) {
          var msgs = this.msgs().msgs;
          m.request({
            method: "GET",
            url: "/api/message/" + msgs[index].id + "?action=delete"
          }).then(function(data) {
            if (validateResponse(data)) {
              if (index === 0) {
                m.route("/pm/" + session.get("mailbox"));
              } else {
                msgs.splice(index, 1);
              }
            }
          });
        }
      }.bind(this);
    }.bind(this);

    this.editor = false;
    this.onMsgSent = function(data) {
      this.msgs().msgs.push(data);
      this.editor = false;
    }.bind(this);
    this.toggleMsgEditor = function() {
      this.editor = !this.editor;
    }.bind(this);
  },
  view: function(ctrl) {
    console.log("# Message.view()");
    if (!ctrl.editor) {
      var body,
        msgs = ctrl.msgs().msgs,
        replyTo = ctrl.msgs().replyTo;

      if (msgs) {
        body = m("article", [
          msgs.map(function(msg, index) {
            return m("section", {
              key: msg.id
            }, [
              m("header", [
                m("a", {
                  href: "/app/web/user/" + msg.uid,
                  config: m.route
                }, msg.username),
                " " + toLocalDateTimeString(new Date(msg.time * 1000))
              ]),
              m("p", [
                msg.body + " ",
                m("button", {
                  onclick: ctrl.delete(index)
                }, index ? "删除" : "删除对话")
              ])
            ]);
          }),
          m("div", m("button", {
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
        active: "/pm/inbox"
      }),
      m.component(NavTab, {
        links: mailboxLinks,
        active: "/pm/" + session.get("mailbox")
      }),
      body
    ];
  }
};
