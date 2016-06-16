"use strict";

var NavTab = {
  view: function(ctrl, data) {
    return m("nav", {
      "class": "navtab"
    }, data.links.map(function(link) {
      var attr = {
        href: link.uri
      };
      if (link.uri === data.active) {
        attr["class"] = "active";
      }
      if (link.uri.startsWith(appBase)) {
        attr["config"] = m.route;
      }
      return m("a", attr, link.name);
    }));
  }
};
