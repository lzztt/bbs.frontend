

var Tag = {
  controller: function() {
    this.id = m.route.param("tid");
    this.nodes = m.request({method: "GET", url: '/api/tag/' + this.id});
    console.log(this.id, this.nodes);
  },
  view: function(ctrl) {
    return m('ul', ctrl.nodes().map(function(node) {
      return m('li', m('a', {href: '/node/' + node.id, config: m.route}, node.title));
    }));
  }
};