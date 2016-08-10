"use strict";

var NavTab = {
  view: function(ctrl, data) {
    return m("nav", {
      "class": "navtab"
    }, data.links.map(function(link) {
      var attr = {
        href: link.uri,
        config: m.route
      };
      if (link.uri === data.active) {
        attr["class"] = "active";
      }
      return m("a", attr, link.name);
    }));
  }
};
