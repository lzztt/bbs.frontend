"use strict";

var NavTab = {
    view: function(ctrl, data) {
        return m("nav", {
            class: "navtab"
        }, data.links.map(function(link) {
            var attr = link.uri == data.active ? {
                class: "active",
                href: link.uri,
                config: m.route
            } : {
                href: link.uri,
                config: m.route
            };
            return m("a", attr, link.name);
        }));
    }
};
