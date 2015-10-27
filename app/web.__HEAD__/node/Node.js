

var Node = {
  controller: function() {
    console.log('# Node.controller()');
    this.id = m.route.param("nid");
    this.node = m.request({method: "GET", url: '/api/node/' + this.id});

    this.loadPage = function(i) {
      this.node = m.request({method: "GET", url: '/api/node/' + this.id + '?p=' + i});
    }.bind(this);
  },
  view: function(ctrl) {
    console.log('# Node.view()');
    var n = ctrl.node();
    console.log(n);
    if (n) {
      console.log('Node view ', n.pageNo, n.pageCount);

      var article = [m('h1', n.title),
        m('section', n.body),
        n.comments.map(function(c) {
          return m('section', c.body);
        })];

      if (n.pageCount > 1) {
        var pager = m.component(Pager, {current: n.pageNo, count: n.pageCount, handler: ctrl.loadPage});
        pager = pager.view(pager.controller()); // just render the component
        article.unshift(pager);
        article.push(pager);
      }

      return m('article', article);
    }
    else {
      return m('article', 'Error: page not found');
    }
  }
};
