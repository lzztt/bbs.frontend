

var Tag = {
  controller: function() {
    this.id = m.route.param("tid");
    this.nodes = m.request({method: "GET", url: '/api/tag/' + this.id});
  },
  view: function(ctrl) {
    console.log(ctrl.nodes());
    return m('ul', ctrl.nodes().map(function(node) {
      return m('li', [
        m('a', {href: '/app/web/node/' + node.id, config: m.route}, node.title),
        m('a', {href: '/app/web/user/' + node.uid, config: m.route}, node.username),
        toLocalDateTimeString(new Date(node.create_time * 1000))
      ]);
    }));
  }
};