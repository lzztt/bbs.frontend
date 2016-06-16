"use strict";

var mailboxLinks = [{
  uri: "/app/user/mailbox/inbox",
  name: "收件箱"
}, {
  uri: "/app/user/mailbox/sent",
  name: "发件箱"
}];

var Mailbox = {
  controller: function() {
    console.log("# Mailbox.controller()");
    if (!validateLoginSession()) {
      m.route("/app/user/login");
      return;
    }

    var self = this;
    var mailbox = m.route().split("/").pop();
    session.set("mailbox", mailbox);

    this.messages = m.request({
      method: "GET",
      url: "/api/message/" + mailbox
    });

    this.loadPage = function(i) {
      self.messages = m.request({
        method: "GET",
        url: "/api/message/" + mailbox + "?p=" + i
      });
    };

    this.deletedMessages = [];
    this.toggleEditMode = function(ev) {
      console.log("self.editMode ", self.editMode);
      self.editMode = !self.editMode;

      if (self.editMode) {
        // edit mode, backup node list
        self.msgsBackup = JSON.parse(JSON.stringify(self.messages().msgs));
      } else {
        // back to view mode, restore node list
        if (self.deletedMessages.length > 0) {
          self.messages().msgs = self.msgsBackup;
        }
      }
      // clear values
      self.deletedMessages = [];
    };

    this.deleteMessage = function(index) {
      return function(ev) {
        var msgs = self.messages().msgs;
        self.deletedMessages.push(msgs[index]);
        msgs.splice(index, 1);
      };
    };

    this.save = function(ev) {
      if (self.deletedMessages.length) {
        var index, mid = "";
        for (var i = 0; i < self.deletedMessages.length; i++) {
          mid += self.deletedMessages[i].mid + ",";
        }

        m.request({
          method: "GET",
          url: "/api/message/" + mid.substring(0, mid.length - 1) + "?action=delete"
        }).then(function(data) {
          if (validateResponse(data)) {
            var p = self.messages().pager;
            if (p.pageNo < p.pageCount) {
              // middle page
              self.loadPage(p.pageNo);
            } else {
              // last page
              if (p.pageNo > 1) {
                self.loadPage(p.pageNo - 1);
              }
            }
          }
        });
      }
      self.editMode = !self.editMode;
      self.deletedMessages = [];
    };
  },
  view: function(ctrl) {
    var msgs = ctrl.messages().msgs,
      p = ctrl.messages().pager;

    console.log("# Mailbox.view() ", p.pageNo, p.pageCount);

    if (msgs.length === 0 && ctrl.deletedMessages.length === 0 && p.pageCount <= 1) {
      return [
        m.component(NavTab, {
          links: userLinks,
          active: "/app/user/mailbox/inbox"
        }),
        m.component(NavTab, {
          links: mailboxLinks,
          active: m.route()
        }),
        m("div", "mailbox is empty, start sending a message.")
      ];
    }

    var table = m("table", {
        "class": "pm_list"
      },
      m("thead",
        m("tr", [
          m("th", "短信"),
          m("th", "联系人"),
          m("th", "时间")
        ])),
      m("tbody", {
          "class": "even_odd_parent"
        },
        msgs.map(function(msg, index) {
          return m("tr", [
            m("td", {
                "data-header": "短信"
              },
              ctrl.editMode ?
              [
                m("i", {
                  "class": "icon-trash",
                  onclick: ctrl.deleteMessage(index)
                }, ""),
                msg.isNew > 0 ? m("span", {
                  style: "color:red;"
                }, "new ") : null,
                m("a", {
                  href: "/app/user/pm/" + msg.mid,
                  config: m.route
                }, msg.body)
              ] :
              [
                msg.isNew > 0 ? m("span", {
                  style: "color:red;"
                }, "new ") : null,
                m("a", {
                  href: "/app/user/pm/" + msg.mid,
                  config: m.route
                }, msg.body)
              ]),
            m("td", {
                "data-header": "联系人"
              },
              m("a", {
                href: "/app/user/" + msg.uid,
                config: m.route
              }, msg.user)),
            m("td", {
              "data-header": "时间"
            }, toLocalDateString(new Date(msg.time * 1000)))
          ]);
        })));
    if (p.pageCount > 1) {
      var pager = m.component(Pager, {
        current: p.pageNo,
        count: p.pageCount,
        handler: ctrl.loadPage
      });
      pager = pager.view(pager.controller()); // just render the component
      table = [pager, table, pager];
    }

    return (ctrl.editMode ?
      [
        m.component(NavTab, {
          links: userLinks,
          active: "/app/user/mailbox/inbox"
        }),
        m.component(NavTab, {
          links: mailboxLinks,
          active: m.route()
        }),
        m("button", {
          type: "button",
          onclick: ctrl.save
        }, "保存"),
        m("button", {
          type: "button",
          onclick: ctrl.toggleEditMode
        }, "取消"),
      ] :
      [
        m.component(NavTab, {
          links: userLinks,
          active: "/app/user/mailbox/inbox"
        }),
        m.component(NavTab, {
          links: mailboxLinks,
          active: m.route()
        }),
        m("button", {
          type: "button",
          onclick: ctrl.toggleEditMode
        }, "编辑"),
      ]).concat(table);
  }
};
