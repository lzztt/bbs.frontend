"use strict";

/**
 *
 * data {
 *  replyTo {id, username}: replyTo user
 *  success: success callback;
 *  topicMID: optional
 * }
 */
var MsgEditor = {
  controller: function(data) {
    console.log("# MsgEditor.controller()");
    console.log(data);

    var self = this;
    var uid = data.replyTo.id,
      topicMID = data.topicMID,
      success = data.success;

    this.toUser = data.replyTo.username;
    this.replyMsg = m.prop("");
    this.sendMsg = function(ev) {
      console.log("message reply submit");
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();

      var msg = self.replyMsg();
      if (msg.length < 5) {
        m.redraw.strategy("none");
        alert("短信内容最少为5个字符");
        return;
      }

      m.request({
          method: "POST",
          url: "/api/message",
          data: {
            toUID: uid,
            body: msg,
            topicMID: topicMID
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
          if (validateResponse(data)) {
            self.replyMsg("");
            // call callback function
            success(data);
          }
        });
    };

    if (data.cancel) {
      self.cancel = function(ev) {
        data.cancel();
      };
    }
  },
  view: function(ctrl) {
    console.log("# MsgEditor.view()");
    return m("form", {
      onsubmit: ctrl.sendMsg,
      onreset: ctrl.cancel,
      config: Form.autoFocus
    }, [
      m.component(Form.Text, {
        label: "收信人",
        value: ctrl.toUser
      }),
      m.component(Form.TextArea, {
        label: "",
        value: ctrl.replyMsg
      }),
      m.component(Form.Button, ctrl.cancel ? [{
        type: "submit",
        value: "发送"
      }, {
        type: "reset",
        value: "取消"
      }] : {
        type: "submit",
        value: "发送"
      })
    ])
  }
};
