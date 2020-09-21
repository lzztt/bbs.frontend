"use strict";

var Bookmark = {
  controller: function() {
    console.log("# Bookmark.controller()");
    if (!validateLoginSession()) {
      session.set("redirect", m.route());
      m.route("/app/user/login");
      return;
    }

    var self = this;
    var uid = cache.get("uid");
    this.bookmarks = m.request({
      method: "GET",
      url: "/api/bookmark/" + uid
    });

    this.loadPage = function(i) {
      self.bookmarks = m.request({
        method: "GET",
        url: "/api/bookmark/" + uid + "?p=" + i
      });
    };

    this.editMode = false;
    this.deletedBookmarks = [];
    this.toggleEditMode = function(ev) {
      console.log("self.editMode ", self.editMode);
      self.editMode = !self.editMode;

      if (self.editMode) {
        // edit mode, backup node list
        self.nodesBackup = JSON.parse(JSON.stringify(self.bookmarks().nodes));
      } else {
        // back to view mode, restore node list
        if (self.deletedBookmarks.length > 0) {
          self.bookmarks().nodes = self.nodesBackup;
        }
      }
      // clear values
      self.deletedBookmarks = [];
    };

    this.deleteBookmark = function(index) {
      return function(ev) {
        var nodes = self.bookmarks().nodes;
        self.deletedBookmarks.push(nodes[index]);
        nodes.splice(index, 1);
      };
    };

    this.save = function(ev) {
      if (self.deletedBookmarks.length) {
        var index, nid = "";
        for (var i = 0; i < self.deletedBookmarks.length; i++) {
          nid += self.deletedBookmarks[i].id + ",";
        }

        m.request({
          method: "DELETE",
          url: "/api/bookmark/" + nid.substring(0, nid.length - 1)
        }).then(function(data) {
          if (validateResponse(data)) {
            var p = self.bookmarks().pager;
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
      self.deletedBookmarks = [];
    };
  },
  view: function(ctrl) {
    console.log("# Bookmark.view()");
    var nodes = ctrl.bookmarks().nodes,
      p = ctrl.bookmarks().pager;
    console.log(nodes);
    if (nodes.length === 0 && ctrl.deletedBookmarks.length === 0 && p.pageCount <= 1) {
      return [
        m.component(NavTab, {
          links: userLinks,
          active: "/app/user/bookmark"
        }),
        m("div", " 收藏夹里还是空空的。 看到感兴趣的帖子，可以点右上角按钮收藏。")
      ];
    }

    var list = ctrl.editMode ?
      m("ul", {
          "class": "bookmarks even_odd_parent"
        },
        nodes.map(function(node, index) {
          return m("li", {
            key: node.id
          }, [
            m("i", {
              "class": "icon-trash",
              onclick: ctrl.deleteBookmark(index)
            }, ""),
            m("a", {
              href: "/node/" + node.id
            }, node.title)
          ]);
        })) :
      m("ul", {
          "class": "bookmarks even_odd_parent"
        },
        nodes.map(function(node) {
          return m("li", {
            key: node.id
          }, m("a", {
            href: "/node/" + node.id
          }, node.title));
        }));

    if (p.pageCount > 1) {
      var pager = m.component(Pager, {
        current: p.pageNo,
        count: p.pageCount,
        handler: ctrl.loadPage
      });
      // pager = pager.view(pager.controller()); // just render the component
      list = [pager, list, pager];
    }

    return (ctrl.editMode ?
      [
        m.component(NavTab, {
          links: userLinks,
          active: "/app/user/bookmark"
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
          active: "/app/user/bookmark"
        }),
        m("button", {
          type: "button",
          onclick: ctrl.toggleEditMode
        }, "编辑"),
      ]).concat(list);
  }
};
