var Tag = {
  controller: function() {
    console.log("Tag.controller");

    this.id = m.route.param("tid");

    var pageNo = 1;
    if (window.location.hash.length > 1) {
      pageNo = window.location.hash.substring(1);
    }

    var self = this;
    this.loadPage = function(i) {
      self.data = m.request({
        method: "GET",
        url: "/api/tag/" + self.id + "?p=" + i
      });

      window.location.hash = '#' + i;
    };
    this.loadPage(pageNo);
  },
  view: function(ctrl) {
    console.log("Tag.view()");

    if (ctrl.editor) {
      return m(MarkxEditor, {
        title: ctrl.editor.data.title,
        body: ctrl.editor.data.body,
        files: ctrl.editor.data.files,
        submit: ctrl.submit,
        cancel: ctrl.cancel
      });
    }

    var data = ctrl.data(),
      nodes = data.nodes,
      pager = data.pager;

    return m("ul", ctrl.nodes.map(function(node) {
      return m("li", [
        m("a", {
          href: "/app/topic/" + node.id,
          config: m.route
        }, node.title),
        m("a", {
          href: "/app/user/" + node.uid,
          config: m.route
        }, node.username),
        toLocalDateTimeString(new Date(node.create_time * 1000))
      ]);
    }));
  }
};
