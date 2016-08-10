"use strict";

var Topic = {
  controller: function() {
    console.log("# Topic.controller()");
    var self = this;
    this.id = m.route.param("nid");
    var pageNo = 1;
    if (window.location.hash.length > 1) {
      pageNo = window.location.hash.substring(1);
    }

    this.loadPage = function(i) {
      self.data = m.request({
        method: "GET",
        url: "/api/node/" + self.id + "?p=" + i
      });

      if (i !== "l") {
        window.location.hash = '#' + i;
      }

      self.config = function(el, isInitialized) {
        console.log("Topic.controller.config isInitialized=", isInitialized);

        if (!isInitialized) {
          // scroll to bottom
          if (i === "l") {
            window.location.hash = '#' + self.data().pager.pageNo;
            window.scrollTo(0, document.body.scrollHeight);
          }
          // position embeded ad
          // set top
          if (ad) {
            var p = document.querySelector("p");
            if (p) {
              ad.top = $(p).offset().top;
              ad.position();
            }
          }
        }
      };
    };
    this.loadPage(pageNo);

    this.uid = cache.get("uid");
    this.isAdmin = (this.uid == 1);

    this.delete = function(ev) {
      console.log("deleteTopic");
      var answer = confirm("此操作不可恢复，您确认要删除整个话题吗？");
      if (answer) {
        m.request({
          method: "GET",
          url: "/api/node/" + self.id + "?action=delete"
        }).then(function(data) {
          if (validateResponse(data)) {
            // redirect to '/app/tag/:tid'
            var tags = this.data().tags;
            if (tags.length) {
              m.route("/app/tag/" + tags[tags.length - 1].id);
            } else {
              m.route("/");
            }
          }
        });
      }
    };

    this.deleteComment = function(index) {
      return function(ev) {
        console.log("deleteComment " + index);
        var answer = confirm("此操作不可恢复，您确认要删除这条评论吗？");
        if (answer) {
          var comments = self.data().comments;
          m.request({
            method: "GET",
            url: "/api/comment/" + comments[index].id + "?action=delete"
          }).then(function(data) {
            if (validateResponse(data)) {
              comments.splice(index, 1);
            }
          });
        }
      };
    };

    var updateFiles = function(node, editorFiles, resp) {
      var fileChanged = false,
        fileAdded = false;

      for (var i = 0; i < editorFiles.length; i++) {
        if ("action" in editorFiles[i]) {
          fileChanged = true;
          if (editorFiles[i].action === "add") {
            fileAdded = true;
            break;
          }
        }
      }

      if (fileChanged) {
        // has file change
        if (fileAdded) {
          // has new files
          node.files = resp.files;
        } else {
          node.files = editorFiles.filter(function(file) {
              return file.action !== "delete";
            })
            .map(function(file) {
              delete file.action;
              return file;
            });
        }
      }
    };

    // editor
    this.edit = function(ev) {
      console.log("edit");
      var topic = self.data().topic;
      self.editor = {
        url: "/api/node/" + self.id + "?action=put",
        data: {
          title: m.prop(topic.title),
          body: m.prop(topic.body),
          files: m.prop(topic.files)
        },
        callback: function(data) {
          topic.last_modified_time = Math.floor(Date.now() / 1000);
          topic.title = self.editor.data.title();
          topic.body = self.editor.data.body();
          updateFiles(topic, self.editor.data.files(), data);
        }
      };
    };

    this.editComment = function(index) {
      return function(ev) {
        console.log("editComment " + index);
        var comment = self.data().comments[index];
        self.editor = {
          url: "/api/comment/" + comment.id + "?action=put",
          data: {
            body: m.prop(comment.body),
            files: m.prop(comment.files)
          },
          callback: function(data) {
            comment.last_modified_time = Math.floor(Date.now() / 1000);
            comment.body = self.editor.data.body();
            updateFiles(comment, self.editor.data.files(), data);
          }
        };
      };
    };

    var commentEditor = function(defaultText) {
      var pager = self.data().pager,
        comments = self.data().comments;

      var data = {
        nid: self.id,
        body: m.prop(defaultText),
        files: m.prop([])
      };

      var returnComments = false;
      if (pager.pageNo == pager.pageCount && (comments.length > 0 && comments.length < pager.commentsPerPage)) {
        // we are on last page, and the page is not full
        returnComments = true;
        data.returnCommentsAfter = comments[comments.length - 1].id;
      }

      return {
        url: "/api/comment",
        data: data,
        callback: function(data) {
          if (returnComments && data.comments && data.comments.length > 0) {
            // already on last page, update new comments
            self.data().comments = self.data().comments.concat(data.comments);
            self.config = function(el, isInitialized) {
              console.log("Topic.callback.config isInitialized=", isInitialized);
              // scroll to bottom
              if (!isInitialized) {
                window.scrollTo(0, document.body.scrollHeight);
              }
            };
          } else {
            // load last page
            self.loadPage("l");
          }
        }
      };
    }

    this.quote = function(quoteText) {
      return function(ev) {
        console.log("quote");
        var lines = quoteText.split(/\n/)
          .filter(function(line) {
            return !line.startsWith("> ");
          })
          .map(function(line) {
            return "> " + line;
          });
        while (lines.length >= 0) {
          if (lines[lines.length - 1].match(/^> *$/) === null) {
            break;
          }
          // empty quote line, remove
          lines.pop();
        }
        if (lines.length === 1) {
          // first line is the author line, so no quote text at all
          // remove all lines
          lines = [];
        }
        self.editor = commentEditor(lines.join("\n"));
      };
    };

    this.reply = function(ev) {
      console.log("reply");
      self.editor = commentEditor("");
    };

    this.submit = function(ev) {
      console.log("submit");
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();

      if ("title" in self.editor.data) {
        if (self.editor.data.title().length < 5) {
          m.redraw.strategy("none");
          alert("标题最少为5个字符");
          return;
        }
      }

      if (!("body" in self.editor.data) || self.editor.data.body().length < 5) {
        m.redraw.strategy("none");
        alert("正文最少为5个字符");
        return;
      }

      m.request({
          method: "POST",
          url: self.editor.url,
          data: self.editor.data
        })
        .then(function(data) {
          console.log(data);
          if (validateResponse(data)) {
            if ("callback" in self.editor) {
              self.editor.callback(data);
            }
            self.editor = null;
          }
        });
    };
    this.cancel = function(ev) {
      self.editor = null;
    };
  },
  view: function(ctrl) {
    console.log("# Topic.view()");

    if (ctrl.editor) {
      ad.hide(); // hide ad
      return m(MarkxEditor, {
        title: ctrl.editor.data.title,
        body: ctrl.editor.data.body,
        files: ctrl.editor.data.files,
        submit: ctrl.submit,
        cancel: ctrl.cancel
      });
    }

    var data = ctrl.data(),
      topic = data.topic,
      tags = data.tags,
      comments = data.comments,
      pager = data.pager;

    console.log(data);

    console.log("Topic view ", pager.pageNo, pager.pageCount);

    var markup = function(body, images) {
      if (images.length === 0) {
        return m.trust(markx(body));
      }

      var ret = [m.trust(markx(body))];
      images.forEach(function(i) {
        if (body.indexOf(i.path) === -1) {
          ret.push(m("figure", [m("figcaption", i.name), m("img[src='" + i.path + "']")]));
        }
      });
      return ret;
    }

    var section = function(node, index = null) {
      return m("section", {
        key: (index === null ? "t" : "c") + node.id
      }, [
        m("header", [
          m("a[href='/app/user/" + node.uid + "']", node.username),
          m("span.city", " " + node.city + " "),
          m("span.time", toLocalDateTimeString(new Date(node.create_time * 1000)) + (node.last_modified_time ? "，最后编辑于 " + toLocalDateTimeString(new Date(node.last_modified_time * 1000)) : "")),
          index !== null ? "#" + (pager.commentsPerPage * (pager.pageNo - 1) + index + 1) : null
        ]),
        markup(node.body, node.files),
        m("div.actions", (ctrl.isAdmin || node.uid == ctrl.uid) ? [
          m("i.icon-edit", {
            onclick: index === null ? ctrl.edit : ctrl.editComment(index)
          }),
          m("i.icon-trash", {
            onclick: index === null ? ctrl.delete : ctrl.deleteComment(index)
          }),
          m("i.icon-quote-left", {
            onclick: ctrl.quote("[g *" + node.username + " :*]\n" + node.body)
          }),
          m("i.icon-comment-empty", {
            onclick: ctrl.reply
          })
        ] : [
          m("i.icon-quote-left", {
            onclick: ctrl.quote(node.body)
          }),
          m("i.icon-comment-empty", {
            onclick: ctrl.reply
          })
        ])
      ]);
    }

    var sections = [];
    if (pager.pageNo == 1) {
      sections.push(section(topic));
    }


    sections = sections.concat(comments.map(function(c, index) {
      return section(c, index);
    }));

    // wrap the elements with key ids
    // so all sibling elements get unique ids
    // then the diff algorithm won't get confused
    var body = m("div", sections);

    if (pager.pageCount > 1) {
      pager = m.component(Pager, {
        current: pager.pageNo,
        count: pager.pageCount,
        handler: ctrl.loadPage
      });
      body = [pager, body, pager];
    }

    return m("article.topic", {
      config: ctrl.config
    }, [
      m("h2", topic.title),
      body,
    ]);
  }
};
